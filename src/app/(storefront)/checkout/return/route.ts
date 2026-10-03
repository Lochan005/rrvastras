import { NextResponse } from "next/server";
import { verifyCashfreeOrder } from "@/lib/cashfree";
import { confirmPaidOrder } from "@/lib/confirm-order";
import { getSiteUrl } from "@/lib/utils";

export async function GET(request: Request) {
  const orderId = new URL(request.url).searchParams.get("order_id");
  const site = getSiteUrl();

  if (!orderId) {
    return NextResponse.redirect(new URL("/checkout", site));
  }

  try {
    const cashfreeOrder = await verifyCashfreeOrder(orderId);
    if (cashfreeOrder.order_status === "PAID") {
      await confirmPaidOrder(orderId);
      return NextResponse.redirect(new URL(`/orders/${orderId}?payment=success`, site));
    }
  } catch (error) {
    console.error("Cashfree return verification failed:", error);
  }

  return NextResponse.redirect(new URL(`/orders/${orderId}?payment=pending`, site));
}
