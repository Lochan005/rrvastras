import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ORDER_STATUS_COPY, formatOrderDate } from "@/lib/order-status";

export default async function OrdersPage() {
  const session = await requireAuth();

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="mx-auto w-full max-w-[1360px] px-gutter-mobile pt-space-md pb-space-4xl lg:px-gutter-desktop">
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
        <span className="font-semibold text-primary">Orders</span>
      </nav>

      <span className="font-label-eyebrow text-label-eyebrow font-bold tracking-[0.25em] text-primary uppercase">
        Drape Logistics
      </span>
      <h1 className="font-headline-xl text-headline-xl-mobile mt-space-2xs tracking-wide text-primary md:text-headline-xl">
        Order History
      </h1>
      <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
        {orders.length} order{orders.length === 1 ? "" : "s"} · Track dispatch and view weave details
      </p>

      {orders.length === 0 ? (
        <div className="mt-space-2xl rounded-xl bg-surface-container-low px-space-lg py-16 text-center">
          <p className="font-headline-sm text-headline-sm text-primary">No orders yet.</p>
          <Link
            href="/shop"
            className="mt-6 inline-flex rounded bg-primary px-space-xl py-space-md font-label-button text-label-button tracking-wider text-on-primary uppercase"
          >
            Shop Collection
          </Link>
        </div>
      ) : (
        <div className="mt-space-2xl space-y-space-md">
          {orders.map((order) => {
            const status = ORDER_STATUS_COPY[order.status] ?? {
              label: order.status.replace("_", " "),
            };
            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-container-low px-space-lg py-space-md">
                  <div className="flex flex-wrap items-center gap-space-md">
                    <div>
                      <span className="block font-label-eyebrow text-[10px] text-outline uppercase">
                        Order ID
                      </span>
                      <span className="font-mono font-semibold text-primary">
                        {order.orderNumber}
                      </span>
                    </div>
                    <div className="hidden h-6 w-px bg-outline-variant/60 sm:block" />
                    <div>
                      <span className="block font-label-eyebrow text-[10px] text-outline uppercase">
                        Placed
                      </span>
                      <span className="font-semibold text-on-surface">
                        {formatOrderDate(order.createdAt)}
                      </span>
                    </div>
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
                <div className="space-y-1 px-space-lg py-space-md font-body-sm text-body-sm text-on-surface-variant">
                  {order.items.map((item) => (
                    <p key={item.id}>
                      {item.productName} × {item.quantity}
                    </p>
                  ))}
                  <p className="pt-2 font-price-md text-price-md font-bold text-on-surface">
                    {formatINR(order.totalInPaise)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
