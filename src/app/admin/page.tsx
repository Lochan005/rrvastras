import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/db";
import { getStoreSettings } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboard() {
  await requireAdmin();
  const settings = await getStoreSettings();

  const [orderCount, pendingOrders, lowStockProducts, recentOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "confirmed" } }),
      prisma.product.findMany({
        where: {
          stock: { gt: 0, lte: settings.lowStockThreshold },
          isPublished: true,
        },
        take: 5,
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { user: { select: { name: true, email: true } } },
      }),
    ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{orderCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted">
              Awaiting Shipment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pendingOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted">
              Low Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{lowStockProducts.length}</p>
          </CardContent>
        </Card>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-medium">Low Stock Alert</h2>
          <div className="mt-4 space-y-2">
            {lowStockProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-lg border border-border bg-white p-3"
              >
                <Link
                  href={`/admin/products/${p.id}/edit`}
                  className="text-sm hover:text-primary"
                >
                  {p.name}
                </Link>
                <Badge variant="warning">{p.stock} left</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-medium">Recent Orders</h2>
        <div className="mt-4 space-y-2">
          {recentOrders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="flex items-center justify-between rounded-lg border border-border bg-white p-4 hover:border-primary"
            >
              <div>
                <p className="font-medium">{order.orderNumber}</p>
                <p className="text-sm text-muted">
                  {order.user.name ?? order.user.email}
                </p>
              </div>
              <div className="text-right">
                <Badge>{order.status.replace("_", " ")}</Badge>
                <p className="mt-1 text-sm">{formatINR(order.totalInPaise)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
