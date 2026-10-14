import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ShipOrderForm } from "@/components/admin/ship-order-form";
import { SHIPMENT_STATUS_COPY } from "@/lib/shipment-status";

interface AdminOrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderPageProps) {
  await requireAdmin();
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      user: { select: { name: true, email: true } },
      shipment: {
        include: {
          events: { orderBy: { eventAt: "desc" }, take: 20 },
        },
      },
    },
  });

  if (!order) notFound();

  const statusColors: Record<string, "default" | "success" | "warning" | "destructive"> = {
    pending_payment: "warning",
    confirmed: "default",
    shipped: "success",
    delivered: "success",
    returned: "warning",
    cancelled: "destructive",
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Order {order.orderNumber}</h1>
      <div className="mt-2 flex items-center gap-3">
        <Badge variant={statusColors[order.status] ?? "default"}>
          {order.status.replace("_", " ")}
        </Badge>
        <span className="text-sm text-muted">
          {order.user.name ?? order.user.email}
        </span>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-white p-6">
          <h2 className="font-medium">Items</h2>
          <div className="mt-4 space-y-2 text-sm">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.productName} × {item.quantity}
                </span>
                <span>{formatINR(item.priceInPaise * item.quantity)}</span>
              </div>
            ))}
          </div>
          <hr className="my-4 border-border" />
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatINR(order.subtotalInPaise)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                {order.shippingInPaise === 0
                  ? "Free"
                  : formatINR(order.shippingInPaise)}
              </span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatINR(order.totalInPaise)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-white p-6">
            <h2 className="font-medium">Delivery Address</h2>
            <p className="mt-2 text-sm text-muted">
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

          {order.shipment && (
            <div className="rounded-lg border border-border bg-white p-6">
              <h2 className="font-medium">India Post shipment</h2>
              <p className="mt-2 text-sm">
                Status:{" "}
                <span className="font-medium">
                  {SHIPMENT_STATUS_COPY[order.shipment.status].label}
                </span>
              </p>
              {order.shipment.articleNumber && (
                <p className="mt-1 text-sm text-muted">
                  Article / AWB: {order.shipment.articleNumber}
                </p>
              )}
              {order.shipment.exceptionMessage && (
                <p className="mt-2 text-sm text-destructive">
                  {order.shipment.exceptionMessage}
                </p>
              )}
              {order.shipment.events.length > 0 && (
                <ul className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                  {order.shipment.events.map((event) => (
                    <li key={event.id}>
                      <span className="font-medium">
                        {event.eventName ?? event.eventCode ?? "Update"}
                      </span>
                      {event.office ? (
                        <span className="text-muted"> · {event.office}</span>
                      ) : null}
                      {event.eventAt ? (
                        <span className="block text-xs text-muted">
                          {event.eventAt.toLocaleString("en-IN")}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {order.status === "confirmed" && !order.shipment && (
            <ShipOrderForm orderId={order.id} />
          )}

          {order.trackingNumber && !order.shipment?.articleNumber && (
            <div className="rounded-lg border border-border bg-white p-6">
              <h2 className="font-medium">Tracking Number</h2>
              <p className="mt-2 text-sm">{order.trackingNumber}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
