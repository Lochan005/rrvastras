import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Home } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { formatOrderDate, getCustomerOrderStatus } from "@/lib/order-status";

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
    include: {
      items: true,
    },
  });

  if (!order) notFound();

  if (session?.user?.id !== order.userId && session?.user?.role !== "admin") {
    notFound();
  }

  const isSuccessReturn = payment === "success";
  const orderConfirmed =
    order.status === "confirmed" ||
    order.status === "shipped" ||
    order.status === "delivered" ||
    order.status === "returned";
  const showConfirmation = isSuccessReturn && orderConfirmed;
  const isPending =
    payment === "pending" && order.status === "pending_payment";
  const status = getCustomerOrderStatus(order.status);

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

      {showConfirmation && (
        <section
          className="mb-space-2xl rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-space-lg py-space-2xl text-center shadow-sm"
          aria-labelledby="order-confirmed-heading"
        >
          <div
            className="mx-auto flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-success/15"
            aria-hidden
          >
            <CheckCircle2 className="h-11 w-11 text-success" strokeWidth={1.75} />
          </div>
          <h1
            id="order-confirmed-heading"
            className="mt-space-lg font-headline-lg text-headline-lg text-on-surface"
          >
            Your order has been confirmed
          </h1>
          <p className="mx-auto mt-space-sm max-w-md font-body-md text-body-md text-on-surface-variant">
            Thank you for shopping with RR Vastras. We&apos;ve received your payment and
            will prepare your order for delivery.
          </p>
          <p className="mt-space-md font-mono text-sm font-semibold text-primary">
            {order.orderNumber}
          </p>
          <p className="mt-1 font-price-md text-price-md font-bold text-on-surface">
            {formatINR(order.totalInPaise)}
          </p>
        </section>
      )}

      {isSuccessReturn && !orderConfirmed && order.status === "pending_payment" && (
        <div className="mb-space-lg rounded-xl bg-surface-container px-space-lg py-space-md text-center">
          <p className="font-headline-sm text-headline-sm text-on-surface">
            Confirming your payment
          </p>
          <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
            This can take a moment. Refresh the page if this message stays.
          </p>
        </div>
      )}

      {isPending && (
        <div className="mb-space-lg rounded-xl bg-surface-container px-space-lg py-space-md text-center">
          <p className="font-headline-sm text-headline-sm text-on-surface">Payment not completed</p>
          <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
            This order is waiting for payment. You can try again from checkout.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">
            {showConfirmation ? "Order details" : `Order ${order.orderNumber}`}
          </h2>
          <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
            Placed on {formatOrderDate(order.createdAt)}
          </p>
        </div>
        <div
          className={cn(
            "rounded-full px-3 py-1 font-label-badge text-label-badge tracking-wider uppercase",
            status.active
              ? "bg-primary/10 text-primary"
              : status.complete
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
        <div className="mt-4 border-t border-outline-variant/40 pt-4 font-body-sm text-body-sm">
          <div className="flex justify-between font-price-md text-price-md font-bold text-on-surface">
            <span>Total paid</span>
            <span>{formatINR(order.totalInPaise)}</span>
          </div>
          <p className="mt-1 text-on-surface-variant">Inclusive of all taxes</p>
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
