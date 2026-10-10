import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSiteUrl } from "@/lib/utils";
import {
  PRODUCT_SHIPPING_COPY,
  PRODUCT_SHIPPING_DURATION,
  SALE_RETURN_NOTE,
} from "@/lib/pricing";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { ProductPrice } from "@/components/storefront/product-price";
import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import { ExchangeReturnPolicyDialog } from "@/components/storefront/exchange-return-policy-dialog";
import { WishlistButton } from "@/components/storefront/wishlist-button";
import { Badge } from "@/components/ui/badge";
import { StorefrontContainer } from "@/components/storefront/ui/storefront-container";
import { PageHeader } from "@/components/storefront/ui/page-header";
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

  const image = product.images.find((media) => media.mediaType !== "video");
  return {
    title: product.name,
    description: product.description || `${product.name} — ${product.productCode} at RR Vastras`,
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

  const product = await prisma.product.findUnique({
    where: { slug, isPublished: true },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });

  if (!product) notFound();

  const isOut = product.stock <= 0;
  const primaryImage = product.images.find(
    (media) => media.mediaType !== "video"
  );
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
      <StorefrontContainer className="py-space-2xl lg:py-space-3xl">
        <PageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            { label: product.name },
          ]}
          title={product.name}
          className="mb-space-xl"
        />
        <div className="grid gap-space-2xl lg:grid-cols-2">
          <div className="lg:sticky lg:sticky-below-header lg:h-fit">
            <ProductGallery images={product.images} />
          </div>

          <div className="flex flex-col">
            <div className="mb-space-lg flex flex-col gap-space-md">
              <div className="flex flex-wrap items-center gap-space-sm">
                <span className="font-label-eyebrow text-label-eyebrow tracking-wider text-outline uppercase">
                  {product.productCode}
                </span>
                {isOut && <Badge variant="destructive">Out of stock</Badge>}
              </div>
              <div>
                <ProductPrice
                  priceInPaise={product.priceInPaise}
                  compareAtPriceInPaise={product.compareAtPriceInPaise}
                  size="detail"
                />
                <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                  Inclusive of all taxes · Ships in {PRODUCT_SHIPPING_DURATION}
                </p>
              </div>
            </div>

            <div className="my-space-lg h-px w-full bg-outline-variant/40" />

            <div className="space-y-space-md">
              {product.description && (
                <p className="max-w-reading font-body-md text-body-md leading-relaxed text-on-surface-variant">
                  {product.description}
                </p>
              )}
              <ul className="space-y-space-sm font-body-sm text-body-sm text-on-surface">
                <li className="flex flex-wrap items-start gap-x-2 gap-y-1">
                  <span className="min-w-28 shrink-0 font-semibold">Product code</span>
                  <span>{product.productCode}</span>
                </li>
                <li className="flex flex-wrap items-start gap-x-2 gap-y-1">
                  <span className="min-w-28 shrink-0 font-semibold">Shipping</span>
                  <span>{PRODUCT_SHIPPING_DURATION}</span>
                </li>
              </ul>
            </div>

            <div className="mt-space-xl flex flex-col gap-space-md sm:flex-row">
              <div className="min-w-0 flex-1">
                <AddToCartButton
                  product={{
                    id: product.id,
                    slug: product.slug,
                    name: product.name,
                    priceInPaise: product.priceInPaise,
                    stock: product.stock,
                    imageUrl: primaryImage?.url ?? "",
                    imageAlt: primaryImage?.alt ?? product.name,
                  }}
                  disabled={isOut}
                />
              </div>
              <WishlistButton productId={product.id} />
            </div>

            <div className="mt-space-2xl rounded border border-outline-variant/40 bg-surface-container-low p-space-lg">
              <h3 className="mb-space-md font-headline-sm text-headline-sm text-primary">
                Delivery &amp; returns
              </h3>
              <ul className="space-y-space-sm font-body-sm text-body-sm text-on-surface-variant">
                <li className="flex gap-space-sm">
                  <span className="text-gold">✦</span>
                  Free shipping on orders above ₹5,000
                </li>
                <li className="flex gap-space-sm">
                  <span className="text-gold">✦</span>
                  {PRODUCT_SHIPPING_COPY}
                </li>
                <li className="flex flex-wrap gap-x-1 gap-y-1">
                  <span className="text-gold">✦</span>
                  <span>
                    {SALE_RETURN_NOTE}{" "}
                    <ExchangeReturnPolicyDialog triggerClassName="font-medium text-primary" />
                  </span>
                </li>
                <li className="flex gap-space-sm">
                  <span className="text-gold">✦</span>
                  Blouse piece included
                </li>
              </ul>
            </div>
          </div>
        </div>
      </StorefrontContainer>
    </>
  );
}
