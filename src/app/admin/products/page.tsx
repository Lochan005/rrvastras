import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AdminProductsPage() {
  await requireAdmin();

  const products = await prisma.product.findMany({
    include: { images: { take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link href="/admin/products/new">
          <Button>Add Product</Button>
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Price</th>
              <th className="pb-3 pr-4">Stock</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-border">
                <td className="py-3 pr-4 font-medium">{product.name}</td>
                <td className="py-3 pr-4">{formatINR(product.priceInPaise)}</td>
                <td className="py-3 pr-4">{product.stock}</td>
                <td className="py-3 pr-4">
                  <Badge variant={product.isPublished ? "success" : "outline"}>
                    {product.isPublished ? "Published" : "Draft"}
                  </Badge>
                </td>
                <td className="py-3">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="text-primary hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
