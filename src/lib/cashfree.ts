import { createHmac, timingSafeEqual } from "crypto";
import { getSiteUrl } from "@/lib/utils";

const API_VERSION = "2025-01-01";

export interface CreateCashfreeOrderInput {
  orderId: string;
  orderAmount: number;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

function getCashfreeBaseUrl(): string {
  return process.env.CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";
}

function getCashfreeHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    "x-client-id": process.env.CASHFREE_APP_ID!,
    "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
    "x-api-version": API_VERSION,
  };
}

export function isCashfreeConfigured(): boolean {
  return Boolean(process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY);
}

export function getCashfreeCheckoutMode(): "sandbox" | "production" {
  return process.env.CASHFREE_ENV === "production" ? "production" : "sandbox";
}

/** Cashfree requires a 10-digit Indian mobile number. */
export function normalizeIndianPhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  const local = digits.length > 10 ? digits.slice(-10) : digits;
  return /^[6-9]\d{9}$/.test(local) ? local : null;
}

export function buildCashfreeReturnUrl(): string {
  return `${getSiteUrl()}/checkout/return`;
}

export function buildCashfreeNotifyUrl(): string {
  return `${getSiteUrl()}/api/webhooks/cashfree`;
}

export async function createCashfreeOrder(input: CreateCashfreeOrderInput) {
  const response = await fetch(`${getCashfreeBaseUrl()}/orders`, {
    method: "POST",
    headers: getCashfreeHeaders(),
    body: JSON.stringify({
      order_id: input.orderId,
      order_amount: input.orderAmount,
      order_currency: "INR",
      customer_details: {
        customer_id: input.customerId,
        customer_name: input.customerName,
        customer_email: input.customerEmail,
        customer_phone: input.customerPhone,
      },
      order_meta: {
        return_url: buildCashfreeReturnUrl(),
        notify_url: buildCashfreeNotifyUrl(),
        payment_methods: "cc,dc,upi,nb",
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Cashfree order creation failed: ${error}`);
  }

  return response.json() as Promise<{
    order_id: string;
    payment_session_id: string;
    order_status: string;
  }>;
}

export async function verifyCashfreeOrder(orderId: string) {
  const response = await fetch(`${getCashfreeBaseUrl()}/orders/${orderId}`, {
    method: "GET",
    headers: getCashfreeHeaders(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Cashfree order verification failed: ${error}`);
  }

  return response.json() as Promise<{
    order_id: string;
    order_status: string;
    order_amount: number;
  }>;
}

export function verifyCashfreeWebhookSignature(
  timestamp: string | null,
  rawBody: string,
  signature: string | null
): boolean {
  const secret = process.env.CASHFREE_SECRET_KEY;
  if (!secret || !timestamp || !signature) return false;

  const computed = createHmac("sha256", secret)
    .update(timestamp + rawBody)
    .digest("base64");
  const expected = Buffer.from(computed);
  const received = Buffer.from(signature);
  if (expected.length !== received.length) return false;
  return timingSafeEqual(expected, received);
}
