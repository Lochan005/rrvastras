import { prisma } from "@/lib/db";
import { verifyCashfreeOrder, verifyCashfreeWebhookSignature } from "@/lib/cashfree";
import { confirmPaidOrder } from "@/lib/confirm-order";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-webhook-signature");
  const timestamp = request.headers.get("x-webhook-timestamp");

  if (!verifyCashfreeWebhookSignature(timestamp, rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let body: { data?: { order?: { order_id?: string } }; type?: string };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const orderId = body.data?.order?.order_id;
  if (!orderId) {
    return NextResponse.json({ received: true });
  }

  if (body.type && body.type !== "PAYMENT_SUCCESS_WEBHOOK") {
    return NextResponse.json({ received: true });
  }

  const order = await prisma.order.findFirst({
    where: {
      OR: [{ id: orderId }, { cashfreeOrderId: orderId }],
    },
  });

  if (!order || order.status !== "pending_payment") {
    return NextResponse.json({ received: true });
  }

  const cashfreeOrder = await verifyCashfreeOrder(order.cashfreeOrderId ?? order.id);
  if (cashfreeOrder.order_status === "PAID") {
    await confirmPaidOrder(order.id);
  }

  return NextResponse.json({ received: true });
}
