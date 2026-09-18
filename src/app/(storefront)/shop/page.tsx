import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  BadgeCheck,
  ChevronRight,
  Handshake,
  ImageIcon,
  Package,
  X,
} from "lucide-react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getStoreSettings } from "@/lib/store";
import { ProductCard } from "@/components/storefront/product-card";
import { ShopFilters } from "@/components/storefront/shop-filters";
import { ShopPagination } from "@/components/storefront/shop-pagination";
import { getSiteUrl, cn } from "@/lib/utils";
import { buildBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Shop Sarees",
  description:
    "Browse our collection of women's sarees — silk, cotton, handloom, and more. Shop elegant sarees at RR Vastras.",
  alternates: {
    canonical: `${getSiteUrl()}/shop`,
  },
};

const PAGE_SIZE = 9;

const CATEGORY_PILLS = [
  { label: "All Sarees", fabric: undefined as string | undefined },
  { label: "Silk Sarees", fabric: "silk" },
  { label: "Cotton Collections", fabric: "cotton" },
  { label: "Handloom Weaves", fabric: "handloom" },
];

const PRICE_LABELS: Record<string, string> = {
  "under-5000": "Under ₹5,000",
  "5000-10000": "₹5,000 - ₹10,000",
  "above-10000": "Above ₹10,000",
};

interface ShopPageProps {
  searchParams: Promise<{
    fabric?: string;
    sort?: string;
    inStock?: string;
    price?: string;
    page?: string;
  }>;
}

function priceWhere(price?: string): Prisma.IntFilter | undefined {
  if (price === "under-5000") return { lt: 500000 };
  if (price === "5000-10000") return { gte: 500000, lte: 1000000 };
  if (price === "above-10000") return { gt: 1000000 };
  return undefined;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const settings = await getStoreSettings();
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const where: Prisma.ProductWhereInput = { isPublished: true };

  if (params.fabric) {
    where.fabric = { contains: params.fabric, mode: "insensitive" };
  }
  if (params.inStock === "true") {
    where.stock = { gt: 0 };
  }
  const priceFilter = priceWhere(params.price);
  if (priceFilter) {
    where.priceInPaise = priceFilter;
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (params.sort === "price-asc") orderBy = { priceInPaise: "asc" };
  if (params.sort === "price-desc") orderBy = { priceInPaise: "desc" };

  const [total, products, published, inStockCount] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: { images: { orderBy: { sortOrder: "asc" } } },
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.findMany({
      where: { isPublished: true },
      select: { fabric: true, stock: true },
    }),
    prisma.product.count({
      where: { isPublished: true, stock: { gt: 0 } },
    }),
  ]);

  const fabricCounts = new Map<string, number>();
  for (const p of published) {
    fabricCounts.set(p.fabric, (fabricCounts.get(p.fabric) ?? 0) + 1);
  }
  const fabrics = [...fabricCounts.entries()].map(([name, count]) => ({
    name,
    count,
  }));

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);

  const breadcrumbLabel = params.fabric
    ? `${params.fabric} sarees`
    : "All Sarees";

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: getSiteUrl() },
    { name: "Shop", url: `${getSiteUrl()}/shop` },
  ]);

  const rest = (omit: string) => {
    const q = new URLSearchParams();
    if (params.fabric && omit !== "fabric") q.set("fabric", params.fabric);
    if (params.sort && omit !== "sort") q.set("sort", params.sort);
    if (params.inStock === "true" && omit !== "inStock") q.set("inStock", "true");
    if (params.price && omit !== "price") q.set("price", params.price);
    const qs = q.toString();
    return qs ? `/shop?${qs}` : "/shop";
  };

  const activeFilters: { key: string; label: string; href: string }[] = [];
  if (params.fabric) {
    activeFilters.push({
      key: "fabric",
      label: params.fabric,
      href: rest("fabric"),
    });
  }
  if (params.price && PRICE_LABELS[params.price]) {
    activeFilters.push({
      key: "price",
      label: PRICE_LABELS[params.price],
      href: rest("price"),
    });
  }
  if (params.inStock === "true") {
    activeFilters.push({
      key: "inStock",
      label: "In stock only",
      href: rest("inStock"),
    });
  }

  const baseParams = {
    fabric: params.fabric,
    sort: params.sort,
    inStock: params.inStock,
    price: params.price,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="flex w-full flex-col">
        <div className="relative w-full overflow-hidden bg-surface-container-low px-gutter-mobile py-space-xl lg:px-gutter-desktop">
          <div className="pointer-events-none absolute -top-20 -right-20 h-96 w-96 rounded-full bg-secondary-fixed-dim/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-32 w-80 bg-tertiary-fixed/30 blur-2xl" />

          <div className="relative z-10 mx-auto flex max-w-[1360px] flex-col gap-space-md">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-space-xs font-label-eyebrow text-label-eyebrow tracking-widest text-on-surface-variant uppercase"
            >
              <Link href="/" className="transition-colors hover:text-primary">
                Home
              </Link>
              <ChevronRight className="h-[13px] w-[13px] text-outline" />
              <Link href="/shop" className="transition-colors hover:text-primary">
                Shop
              </Link>
              <ChevronRight className="h-[13px] w-[13px] text-outline" />
              <span className="font-bold text-primary">{breadcrumbLabel}</span>
            </nav>

            <div className="flex flex-col justify-between gap-space-md pt-space-xs md:flex-row md:items-end">
              <div>
                <span className="font-label-eyebrow text-label-eyebrow font-bold tracking-[0.25em] text-primary uppercase">
                  The Heritage Loom Portfolio
                </span>
                <h1 className="font-headline-xl text-headline-xl-mobile mt-space-2xs tracking-wide text-primary md:text-headline-xl">
                  Curated Saree Collections
                </h1>
                <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                  Showing {total} handcrafted saree{total === 1 ? "" : "s"} · Prices
                  inclusive of all taxes
                </p>
              </div>
              <div className="flex items-center gap-space-xs self-start rounded bg-surface-container-lowest px-space-md py-space-xs font-body-sm text-body-sm text-on-surface-variant shadow-sm md:self-auto">
                <BadgeCheck className="h-[18px] w-[18px] fill-tertiary-fixed-dim text-tertiary-fixed-dim" />
                <span className="font-medium">
                  Silk Mark &amp; Authentic Handloom Certified
                </span>
              </div>
            </div>

            <div className="flex items-center gap-space-sm overflow-x-auto pt-space-sm pb-space-2xs">
              {CATEGORY_PILLS.map((pill) => {
                const selected = pill.fabric
                  ? params.fabric?.toLowerCase() === pill.fabric
                  : !params.fabric;
                return (
                  <Link
                    key={pill.label}
                    href={pill.fabric ? `/shop?fabric=${pill.fabric}` : "/shop"}
                    className={cn(
                      "whitespace-nowrap rounded px-space-md py-space-xs font-label-button text-label-button uppercase transition-colors",
                      selected
                        ? "bg-primary text-on-primary shadow-sm"
                        : "bg-surface-container text-on-surface-variant hover:bg-surface-variant"
                    )}
                  >
                    {pill.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[1360px] px-gutter-mobile py-space-2xl lg:px-gutter-desktop">
          <div className="flex flex-col items-start gap-space-2xl lg:flex-row">
            <Suspense fallback={<div className="w-full shrink-0 lg:w-[270px]" />}>
              <ShopFilters
                fabrics={fabrics}
                totalCount={published.length}
                inStockCount={inStockCount}
                currentFabric={params.fabric}
                currentSort={params.sort}
                currentPrice={params.price}
                inStockOnly={params.inStock === "true"}
              />
            </Suspense>

            <div className="flex w-full flex-1 flex-col gap-space-2xl">
              <div className="flex flex-wrap items-center justify-between gap-space-sm rounded bg-surface-container-lowest px-space-md py-space-xs shadow-xs">
                <div className="flex flex-wrap items-center gap-space-xs">
                  <span className="font-label-eyebrow text-[10px] text-outline uppercase">
                    Active Filters:
                  </span>
                  {activeFilters.length === 0 ? (
                    <span className="font-label-badge text-[11px] text-on-surface-variant">
                      None
                    </span>
                  ) : (
                    activeFilters.map((filter) => (
                      <Link
                        key={filter.key}
                        href={filter.href}
                        className="inline-flex items-center gap-1 rounded bg-surface-container-high px-space-xs py-0.5 font-label-badge text-[11px] text-on-surface hover:text-primary"
                      >
                        {filter.label}
                        <X className="h-3.5 w-3.5" />
                      </Link>
                    ))
                  )}
                </div>
                <span className="font-body-sm text-body-sm text-outline">
                  Showing {products.length} of {total} creations
                </span>
              </div>

              {products.length === 0 ? (
                <div className="rounded bg-surface-container-low px-space-lg py-20 text-center">
                  <p className="font-headline-sm text-headline-sm text-primary">
                    No sarees match your filters
                  </p>
                  <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
                    Try adjusting your selection or clear all filters.
                  </p>
                  <Link
                    href="/shop"
                    className="mt-6 inline-flex rounded bg-primary px-space-xl py-space-md font-label-button text-label-button tracking-wider text-on-primary uppercase"
                  >
                    Clear filters
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-space-lg sm:grid-cols-2 xl:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>
              )}

              <ShopPagination
                page={currentPage}
                pageCount={pageCount}
                shown={products.length}
                total={total}
                baseParams={baseParams}
              />
            </div>
          </div>
        </div>

        <section className="mt-space-3xl w-full bg-surface-container-lowest py-space-2xl">
          <div className="mx-auto grid max-w-[1360px] grid-cols-1 gap-space-xl px-gutter-mobile md:grid-cols-3 lg:px-gutter-desktop">
            <div className="flex items-start gap-space-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-primary-fixed text-primary">
                <Handshake className="h-[26px] w-[26px]" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-headline-sm text-headline-sm text-primary">
                  Direct from Master Weavers
                </h3>
                <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                  Sourced ethically across handloom belts with verified fair wages paid to artisan families.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-space-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-tertiary-fixed text-tertiary">
                <ImageIcon className="h-[26px] w-[26px]" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-headline-sm text-headline-sm text-primary">
                  Silk Mark 100% Purity
                </h3>
                <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                  Every silk drape carries a government-issued Silk Mark QR label certifying pure warp &amp; weft threads.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-space-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-secondary-fixed text-secondary">
                <Package className="h-[26px] w-[26px]" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-headline-sm text-headline-sm text-primary">
                  Boutique Presentation Box
                </h3>
                <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                  Packaged in breathable handloom cotton dust bags within our signature burgundy gift presentation case.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
