import { prisma } from "@/lib/db";
import { verifyCashfreeOrder } from "@/lib/cashfree";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderId = body.data?.order?.order_id ?? body.orderId;

    if (!orderId) {
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: orderId }, { cashfreeOrderId: orderId }],
      },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "pending_payment") {
      return NextResponse.json({ received: true });
    }

    let paymentSuccess = false;

    if (order.cashfreeOrderId?.startsWith("mock-")) {
      paymentSuccess = true;
    } else {
      const cfOrder = await verifyCashfreeOrder(
        order.cashfreeOrderId ?? order.id
      );
      paymentSuccess =
        cfOrder.order_status === "PAID" ||
        cfOrder.order_status === "ACTIVE";
    }

    if (paymentSuccess) {
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: order.id },
          data: { status: "confirmed" },
        });

        for (const item of order.items) {
          if (item.productId) {
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } },
            });
          }
        }
      });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Cashfree webhook error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
