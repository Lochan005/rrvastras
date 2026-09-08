import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  createCashfreeOrder,
  buildCashfreeReturnUrl,
  buildCashfreeNotifyUrl,
  isCashfreeConfigured,
} from "@/lib/cashfree";
import { calculateShipping, getStoreSettings } from "@/lib/store";
import { generateOrderNumber } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { addressId, items } = await request.json();

  if (!addressId || !items?.length) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const address = await prisma.address.findFirst({
    where: { id: addressId, userId: session.user.id },
  });

  if (!address) {
    return NextResponse.json({ error: "Address not found" }, { status: 404 });
  }

  const productIds = items.map((i: { productId: string }) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isPublished: true },
  });

  if (products.length !== items.length) {
    return NextResponse.json({ error: "Some products unavailable" }, { status: 400 });
  }

  let subtotalInPaise = 0;
  const orderItems: {
    productId: string;
    productName: string;
    productSlug: string;
    priceInPaise: number;
    quantity: number;
  }[] = [];

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product || product.stock < item.quantity) {
      return NextResponse.json(
        { error: `${product?.name ?? "Product"} is out of stock` },
        { status: 400 }
      );
    }
    subtotalInPaise += product.priceInPaise * item.quantity;
    orderItems.push({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      priceInPaise: product.priceInPaise,
      quantity: item.quantity,
    });
  }

  const settings = await getStoreSettings();
  const shippingInPaise = calculateShipping(subtotalInPaise, settings);
  const totalInPaise = subtotalInPaise + shippingInPaise;
  const orderNumber = generateOrderNumber();

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: session.user.id,
      status: "pending_payment",
      subtotalInPaise,
      shippingInPaise,
      totalInPaise,
      addressName: address.name,
      addressPhone: address.phone,
      addressLine1: address.line1,
      addressLine2: address.line2,
      addressCity: address.city,
      addressState: address.state,
      addressPincode: address.pincode,
      items: { create: orderItems },
    },
  });

  if (!isCashfreeConfigured()) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "confirmed", cashfreeOrderId: `mock-${order.id}` },
    });

    for (const item of orderItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return NextResponse.json({
      orderId: order.id,
      cashfreeMode: "mock",
    });
  }

  try {
    const cashfreeOrder = await createCashfreeOrder({
      orderId: order.id,
      orderAmount: totalInPaise / 100,
      orderCurrency: "INR",
      customerDetails: {
        customerId: session.user.id,
        customerEmail: session.user.email ?? "",
        customerPhone: address.phone,
      },
      orderMeta: {
        returnUrl: buildCashfreeReturnUrl(order.id),
        notifyUrl: buildCashfreeNotifyUrl(),
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { cashfreeOrderId: cashfreeOrder.order_id },
    });

    return NextResponse.json({
      orderId: order.id,
      paymentSessionId: cashfreeOrder.payment_session_id,
      cashfreeMode:
        process.env.CASHFREE_ENV === "production" ? "production" : "sandbox",
    });
  } catch (err) {
    await prisma.order.delete({ where: { id: order.id } });
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Payment init failed" },
      { status: 500 }
    );
  }
}
