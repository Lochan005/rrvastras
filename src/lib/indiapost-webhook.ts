import { createHmac, timingSafeEqual } from "crypto";
import {
  Prisma,
  type Order,
  type OrderStatus,
  type ShipmentStatus,
} from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSiteUrl } from "@/lib/utils";

export type IndiapostWebhookSource = "booking" | "event";

/** Normalized fields extracted from India Post webhook JSON (field names vary by API version). */
export interface IndiapostWebhookPayload {
  articleNumber?: string;
  reference?: string;
  eventCode?: string;
  eventName?: string;
  eventAt?: Date;
  office?: string;
  officeId?: string;
  raw: Record<string, unknown>;
}

const SIGNATURE_HEADERS = [
  "x-indiapost-signature",
  "x-webhook-signature",
  "x-signature",
] as const;

export function buildIndiapostBookingWebhookUrl(): string {
  return `${getSiteUrl()}/api/webhooks/indiapost/booking`;
}

export function buildIndiapostEventsWebhookUrl(): string {
  return `${getSiteUrl()}/api/webhooks/indiapost/events`;
}

export function verifyIndiapostWebhookSignature(
  rawBody: string,
  request: Request
): boolean {
  const secret = process.env.INDIAPOST_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }

  let signature: string | null = null;
  for (const header of SIGNATURE_HEADERS) {
    const value = request.headers.get(header);
    if (value) {
      signature = value.replace(/^sha256=/i, "").trim();
      break;
    }
  }

  if (!signature) return false;

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");

  try {
    const a = Buffer.from(signature, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function pickString(
  obj: Record<string, unknown>,
  keys: string[]
): string | undefined {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }
  return undefined;
}

function parseEventDate(value: unknown): Date | undefined {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return undefined;
}

/** Flattens common wrapper shapes: { data: {...} }, single object, or array[0]. */
export function parseIndiapostWebhookBody(
  body: unknown
): IndiapostWebhookPayload[] {
  if (Array.isArray(body)) {
    return body.flatMap((item) => parseIndiapostWebhookBody(item));
  }

  const root = asRecord(body);
  if (!root) return [];

  const nested =
    asRecord(root.data) ??
    asRecord(root.payload) ??
    asRecord(root.event) ??
    root;

  const articleNumber = pickString(nested, [
    "articleNumber",
    "article_number",
    "articleNo",
    "article_no",
    "barcode",
    "trackingNumber",
    "tracking_number",
    "awb",
    "AWB",
  ]);

  const reference = pickString(nested, [
    "reference",
    "invoice_no",
    "invoiceNo",
    "invoice_number",
    "orderReference",
    "order_reference",
    "customerReference",
    "bookingReference",
  ]);

  const eventCode = pickString(nested, [
    "eventCode",
    "event_code",
    "event",
    "statusCode",
    "status_code",
  ]);

  const eventName = pickString(nested, [
    "eventName",
    "event_name",
    "eventDescription",
    "event_description",
    "status",
    "description",
  ]);

  const eventAt =
    parseEventDate(nested.eventAt) ??
    parseEventDate(nested.event_at) ??
    parseEventDate(nested.eventDate) ??
    parseEventDate(nested.event_date) ??
    parseEventDate(nested.date);

  const office = pickString(nested, ["office", "officeName", "office_name"]);
  const officeId = pickString(nested, ["officeid", "officeId", "office_id"]);

  return [
    {
      articleNumber,
      reference,
      eventCode,
      eventName,
      eventAt,
      office,
      officeId,
      raw: nested,
    },
  ];
}

export function mapIndiapostEventToShipmentStatus(
  eventCode?: string,
  eventName?: string
): ShipmentStatus {
  const haystack = `${eventCode ?? ""} ${eventName ?? ""}`.toLowerCase();

  if (
    haystack.includes("deliver") &&
    !haystack.includes("not deliver") &&
    !haystack.includes("undeliver")
  ) {
    return "delivered";
  }
  if (
    haystack.includes("not deliver") ||
    haystack.includes("undeliver") ||
    haystack.includes("delivery failed")
  ) {
    return "delivery_failed";
  }
  if (haystack.includes("return")) return "returned";
  if (haystack.includes("redirect")) return "redirected";
  if (haystack.includes("hold")) return "on_hold";
  if (haystack.includes("out for delivery") || haystack.includes("ofd")) {
    return "out_for_delivery";
  }
  if (
    haystack.includes("transit") ||
    haystack.includes("bagged") ||
    haystack.includes("dispatched")
  ) {
    return "in_transit";
  }
  if (haystack.includes("book")) return "booked";
  if (haystack.includes("exception") || haystack.includes("delay")) {
    return "exception";
  }

  return "in_transit";
}

function orderStatusForShipment(status: ShipmentStatus): OrderStatus | null {
  switch (status) {
    case "booked":
    case "in_transit":
    case "out_for_delivery":
    case "redirected":
      return "shipped";
    case "delivered":
      return "delivered";
    case "returned":
      return "returned";
    case "on_hold":
    case "delivery_failed":
    case "exception":
      return "shipped";
    default:
      return null;
  }
}

async function resolveOrder(
  payload: IndiapostWebhookPayload
): Promise<Order | null> {
  if (payload.reference) {
    const byRef = await prisma.order.findFirst({
      where: {
        OR: [
          { orderNumber: payload.reference },
          { id: payload.reference },
        ],
      },
    });
    if (byRef) return byRef;
  }

  if (payload.articleNumber) {
    const shipment = await prisma.shipment.findUnique({
      where: { articleNumber: payload.articleNumber },
    });
    if (shipment) {
      return prisma.order.findUnique({ where: { id: shipment.orderId } });
    }

    const byTracking = await prisma.order.findFirst({
      where: { trackingNumber: payload.articleNumber },
    });
    if (byTracking) return byTracking;
  }

  return null;
}

function buildIdempotencyKey(
  source: IndiapostWebhookSource,
  payload: IndiapostWebhookPayload
): string {
  const parts = [
    source,
    payload.articleNumber ?? "no-article",
    payload.eventCode ?? "no-code",
    payload.eventAt?.toISOString() ?? "no-time",
    payload.reference ?? "no-ref",
  ];
  return createHmac("sha256", "indiapost-idempotency")
    .update(parts.join("|"))
    .digest("hex");
}

async function recordEvent(
  shipmentId: string,
  source: IndiapostWebhookSource,
  payload: IndiapostWebhookPayload
): Promise<boolean> {
  const idempotencyKey = buildIdempotencyKey(source, payload);
  try {
    await prisma.shipmentEvent.create({
      data: {
        shipmentId,
        source,
        eventCode: payload.eventCode,
        eventName: payload.eventName,
        eventAt: payload.eventAt,
        office: payload.office,
        officeId: payload.officeId,
        idempotencyKey,
        rawPayload: payload.raw as Prisma.InputJsonValue,
      },
    });
    return true;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return false;
    }
    throw error;
  }
}

async function upsertShipmentForOrder(
  order: Order,
  payload: IndiapostWebhookPayload,
  status: ShipmentStatus,
  exceptionMessage?: string
) {
  const articleNumber = payload.articleNumber ?? order.trackingNumber ?? undefined;

  const shipment = await prisma.shipment.upsert({
    where: { orderId: order.id },
    create: {
      orderId: order.id,
      carrier: "indiapost",
      articleNumber: articleNumber ?? null,
      bookingReference: payload.reference ?? order.orderNumber,
      status,
      exceptionMessage: exceptionMessage ?? null,
      lastEventCode: payload.eventCode ?? null,
      lastEventAt: payload.eventAt ?? new Date(),
      lastEventOffice: payload.office ?? null,
    },
    update: {
      ...(articleNumber ? { articleNumber } : {}),
      ...(payload.reference ? { bookingReference: payload.reference } : {}),
      status,
      ...(exceptionMessage !== undefined
        ? { exceptionMessage }
        : {}),
      lastEventCode: payload.eventCode ?? undefined,
      lastEventAt: payload.eventAt ?? new Date(),
      lastEventOffice: payload.office ?? undefined,
    },
  });

  if (articleNumber && order.trackingNumber !== articleNumber) {
    await prisma.order.update({
      where: { id: order.id },
      data: { trackingNumber: articleNumber },
    });
  }

  return shipment;
}

async function applyOrderStatusFromShipment(
  order: Order,
  shipmentStatus: ShipmentStatus
) {
  const next = orderStatusForShipment(shipmentStatus);
  if (!next || order.status === "cancelled" || order.status === "pending_payment") {
    return;
  }

  const rank: Record<OrderStatus, number> = {
    pending_payment: 0,
    confirmed: 1,
    shipped: 2,
    delivered: 3,
    returned: 3,
    cancelled: -1,
  };

  if (rank[next] > rank[order.status]) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: next },
    });
  }
}

export async function processIndiapostBookingWebhook(
  payloads: IndiapostWebhookPayload[]
): Promise<{ processed: number; skipped: number; unmatched: number }> {
  let processed = 0;
  let skipped = 0;
  let unmatched = 0;

  for (const payload of payloads) {
    const order = await resolveOrder(payload);
    if (!order) {
      unmatched += 1;
      continue;
    }

    const shipment = await upsertShipmentForOrder(order, payload, "booked");
    const isNew = await recordEvent(shipment.id, "booking", payload);
    if (!isNew) {
      skipped += 1;
      continue;
    }

    processed += 1;
  }

  return { processed, skipped, unmatched };
}

export async function processIndiapostEventsWebhook(
  payloads: IndiapostWebhookPayload[]
): Promise<{ processed: number; skipped: number; unmatched: number }> {
  let processed = 0;
  let skipped = 0;
  let unmatched = 0;

  for (const payload of payloads) {
    const order = await resolveOrder(payload);
    if (!order) {
      unmatched += 1;
      continue;
    }

    const shipmentStatus = mapIndiapostEventToShipmentStatus(
      payload.eventCode,
      payload.eventName
    );

    let exceptionMessage: string | undefined;
    if (
      shipmentStatus === "on_hold" ||
      shipmentStatus === "delivery_failed" ||
      shipmentStatus === "exception"
    ) {
      exceptionMessage =
        payload.eventName ??
        payload.eventCode ??
        "Shipment exception reported by India Post";
    }

    const shipment = await upsertShipmentForOrder(
      order,
      payload,
      shipmentStatus,
      exceptionMessage
    );

    const isNew = await recordEvent(shipment.id, "event", payload);
    if (!isNew) {
      skipped += 1;
      continue;
    }

    await applyOrderStatusFromShipment(order, shipmentStatus);
    processed += 1;
  }

  return { processed, skipped, unmatched };
}
