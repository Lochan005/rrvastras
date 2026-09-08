import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function AdminOrdersPage() {
  await requireAdmin();

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });

  const statusColors: Record<string, "default" | "success" | "warning" | "destructive"> = {
    pending_payment: "warning",
    confirmed: "default",
    shipped: "success",
    cancelled: "destructive",
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Orders</h1>

      <div className="mt-8 space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/admin/orders/${order.id}`}
            className="flex items-center justify-between rounded-lg border border-border bg-white p-4 hover:border-primary"
          >
            <div>
              <p className="font-medium">{order.orderNumber}</p>
              <p className="text-sm text-muted">
                {order.user.name ?? order.user.email} ·{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>
            <div className="text-right">
              <Badge variant={statusColors[order.status] ?? "default"}>
                {order.status.replace("_", " ")}
              </Badge>
              <p className="mt-1 text-sm font-medium">
                {formatINR(order.totalInPaise)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
