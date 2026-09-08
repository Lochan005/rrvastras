import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ORDER_STATUS_COPY, formatOrderDate } from "@/lib/order-status";

interface OrderPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment?: string }>;
}

export default async function OrderPage({
  params,
  searchParams,
}: OrderPageProps) {
  const { id } = await params;
  const { payment } = await searchParams;
  const session = await auth();

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) notFound();

  if (session?.user?.id !== order.userId && session?.user?.role !== "admin") {
    notFound();
  }

  const isSuccess = payment === "success" || payment === "return";
  const status = ORDER_STATUS_COPY[order.status] ?? {
    label: order.status.replace("_", " "),
  };

  return (
    <div className="mx-auto w-full max-w-[760px] px-gutter-mobile pt-space-md pb-space-4xl lg:px-gutter-desktop">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-space-xs pb-space-lg font-body-sm text-body-sm text-on-surface-variant"
      >
        <Link href="/" className="flex items-center gap-1 hover:text-primary">
          <Home className="h-4 w-4" />
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-outline" />
        <Link href="/account" className="hover:text-primary">
          My Account
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-outline" />
        <Link href="/account/orders" className="hover:text-primary">
          Orders
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-outline" />
        <span className="font-semibold text-primary">{order.orderNumber}</span>
      </nav>

      {isSuccess && order.status === "confirmed" && (
        <div className="mb-space-lg rounded-xl bg-primary/10 px-space-lg py-space-md text-center">
          <p className="font-headline-sm text-headline-sm text-primary">Payment successful!</p>
          <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
            Thank you for your order. We&apos;ll ship it soon.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary">
            Order {order.orderNumber}
          </h1>
          <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
            Placed on {formatOrderDate(order.createdAt)}
          </p>
        </div>
        <div
          className={cn(
            "rounded-full px-3 py-1 font-label-badge text-label-badge tracking-wider uppercase",
            status.active
              ? "bg-primary/10 text-primary"
              : status.shipped
                ? "bg-surface-container-high text-secondary"
                : "bg-surface-container-high text-on-surface"
          )}
        >
          {status.label}
        </div>
      </div>

      <div className="mt-space-xl rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
        <h2 className="font-headline-sm text-headline-sm text-on-surface">Items</h2>
        <div className="mt-4 space-y-3 font-body-sm text-body-sm">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between gap-4">
              <span className="text-on-surface-variant">
                {item.productName} × {item.quantity}
              </span>
              <span className="font-medium text-on-surface">
                {formatINR(item.priceInPaise * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2 border-t border-outline-variant/40 pt-4 font-body-sm text-body-sm">
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Subtotal</span>
            <span>{formatINR(order.subtotalInPaise)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Shipping</span>
            <span>
              {order.shippingInPaise === 0 ? "Free" : formatINR(order.shippingInPaise)}
            </span>
          </div>
          <div className="flex justify-between font-price-md text-price-md font-bold text-on-surface">
            <span>Total</span>
            <span>{formatINR(order.totalInPaise)}</span>
          </div>
        </div>
      </div>

      <div className="mt-space-lg rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
        <h2 className="font-headline-sm text-headline-sm text-on-surface">Delivery Address</h2>
        <p className="mt-2 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
          {order.addressName}
          <br />
          {order.addressLine1}
          {order.addressLine2 && `, ${order.addressLine2}`}
          <br />
          {order.addressCity}, {order.addressState} — {order.addressPincode}
          <br />
          {order.addressPhone}
        </p>
      </div>

      {order.trackingNumber && (
        <div className="mt-space-lg rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Tracking</h2>
          <p className="mt-2 font-mono text-sm text-primary">{order.trackingNumber}</p>
        </div>
      )}

      <div className="mt-space-xl flex flex-wrap gap-space-sm">
        <Link
          href="/account/orders"
          className="inline-flex rounded bg-surface-container px-space-lg py-space-sm font-label-button text-label-button text-on-surface uppercase"
        >
          All Orders
        </Link>
        <Link
          href="/shop"
          className="inline-flex rounded bg-primary px-space-lg py-space-sm font-label-button text-label-button text-on-primary uppercase"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
