import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ShipOrderForm } from "@/components/admin/ship-order-form";

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
    },
  });

  if (!order) notFound();

  const statusColors: Record<string, "default" | "success" | "warning" | "destructive"> = {
    pending_payment: "warning",
    confirmed: "default",
    shipped: "success",
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

          {order.status === "confirmed" && (
            <ShipOrderForm orderId={order.id} />
          )}

          {order.trackingNumber && (
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
