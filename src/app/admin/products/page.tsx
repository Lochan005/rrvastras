import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/utils";
import { getDiscountPercent } from "@/lib/pricing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AdminProductsPageProps {
  searchParams: Promise<{ code?: string }>;
}

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  await requireAdmin();

  const { code: codeParam } = await searchParams;
  const codeFilter = codeParam?.trim() ?? "";

  const products = await prisma.product.findMany({
    where: codeFilter
      ? {
          productCode: { contains: codeFilter, mode: "insensitive" },
        }
      : undefined,
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

      <form
        method="get"
        role="search"
        className="mt-6 flex max-w-md flex-col gap-2 sm:flex-row sm:items-center"
      >
        <Input
          type="search"
          name="code"
          defaultValue={codeFilter}
          placeholder="Search by product code"
          aria-label="Search by product code"
          className="bg-background"
        />
        <div className="flex shrink-0 gap-2">
          <Button type="submit" variant="outline">
            Search
          </Button>
          {codeFilter ? (
            <Button asChild variant="ghost">
              <Link href="/admin/products">Clear</Link>
            </Button>
          ) : null}
        </div>
      </form>

      {codeFilter && products.length === 0 ? (
        <p className="mt-8 text-sm text-muted">
          No products match product code &ldquo;{codeFilter}&rdquo;.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Product code</th>
                <th className="pb-3 pr-4">Price</th>
                <th className="pb-3 pr-4">Off</th>
                <th className="pb-3 pr-4">Stock</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const discountPercent = getDiscountPercent(
                  product.compareAtPriceInPaise,
                  product.priceInPaise
                );
                return (
                  <tr key={product.id} className="border-b border-border">
                    <td className="max-w-[240px] py-3 pr-4 font-medium">
                      <span className="line-clamp-2">{product.name}</span>
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs tracking-wide uppercase text-muted">
                      {product.productCode}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span>{formatINR(product.priceInPaise)}</span>
                        {discountPercent != null &&
                        product.compareAtPriceInPaise != null ? (
                          <span className="text-muted line-through">
                            {formatINR(product.compareAtPriceInPaise)}
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      {discountPercent != null ? `${discountPercent}%` : "—"}
                    </td>
                    <td className="py-3 pr-4">{product.stock}</td>
                    <td className="py-3 pr-4">
                      <Badge
                        variant={product.isPublished ? "success" : "outline"}
                      >
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
