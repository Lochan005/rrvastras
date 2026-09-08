import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getStoreSettings, getStockStatus } from "@/lib/store";
import { formatINR, getSiteUrl } from "@/lib/utils";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import { WishlistButton } from "@/components/storefront/wishlist-button";
import { Badge } from "@/components/ui/badge";
import {
  buildBreadcrumbJsonLd,
  buildProductJsonLd,
} from "@/lib/seo";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug, isPublished: true },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });

  if (!product) return { title: "Product Not Found" };

  const image = product.images[0];
  return {
    title: product.name,
    description: product.description || `${product.name} — ${product.fabric} saree at RR Vastras`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: image ? [{ url: image.url, alt: image.alt }] : [],
    },
    alternates: {
      canonical: `${getSiteUrl()}/shop/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const settings = await getStoreSettings();

  const product = await prisma.product.findUnique({
    where: { slug, isPublished: true },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });

  if (!product) notFound();

  const stockStatus = getStockStatus(product.stock, settings.lowStockThreshold);
  const productJsonLd = buildProductJsonLd(product);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: getSiteUrl() },
    { name: "Shop", url: `${getSiteUrl()}/shop` },
    { name: product.name, url: `${getSiteUrl()}/shop/${product.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left: Images */}
          <div className="sticky top-24 h-fit">
            <ProductGallery images={product.images} />
          </div>

          {/* Right: Details */}
          <div className="flex flex-col pt-4">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium uppercase tracking-wider text-muted">
                  {product.fabric}
                </span>
                {stockStatus === "out_of_stock" && (
                  <Badge variant="destructive">Out of stock</Badge>
                )}
                {stockStatus === "low_stock" && (
                  <Badge variant="warning">Only {product.stock} left</Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight">
                {product.name}
              </h1>
              <p className="text-3xl font-medium text-foreground">
                {formatINR(product.priceInPaise)}
                <span className="text-sm text-muted font-normal ml-2">Inclusive of all taxes</span>
              </p>
            </div>

            <div className="h-px w-full bg-border my-8" />

            <div className="space-y-6">
              {product.description && (
                <div className="prose prose-sm text-muted leading-relaxed">
                  <p>{product.description}</p>
                </div>
              )}

              <ul className="space-y-3 text-sm text-foreground">
                <li className="flex items-start gap-2">
                  <span className="font-semibold w-24 shrink-0">Fabric:</span>
                  <span>{product.fabric}</span>
                </li>
                {product.blouseIncluded && (
                  <li className="flex items-start gap-2">
                    <span className="font-semibold w-24 shrink-0">Blouse:</span>
                    <span className="text-success flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Included
                    </span>
                  </li>
                )}
              </ul>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <AddToCartButton
                  product={{
                    id: product.id,
                    slug: product.slug,
                    name: product.name,
                    priceInPaise: product.priceInPaise,
                    stock: product.stock,
                    imageUrl: product.images[0]?.url ?? "",
                    imageAlt: product.images[0]?.alt ?? product.name,
                  }}
                  disabled={stockStatus === "out_of_stock"}
                />
              </div>
              <WishlistButton productId={product.id} />
            </div>
            
            <div className="mt-12 bg-accent/50 p-6 rounded-sm border border-border">
              <h3 className="font-serif font-semibold text-lg mb-4">Delivery & Returns</h3>
              <ul className="space-y-3 text-sm text-muted">
                <li className="flex gap-3">
                  <span className="text-gold">✦</span>
                  Free shipping on orders above ₹7,500
                </li>
                <li className="flex gap-3">
                  <span className="text-gold">✦</span>
                  Delivery within 5-7 business days
                </li>
                <li className="flex gap-3">
                  <span className="text-gold">✦</span>
                  48-hour return window for unused items
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
