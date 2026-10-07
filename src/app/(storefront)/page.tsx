import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/storefront/product-card";
import { HomeFaq } from "@/components/storefront/home-faq";
import { HomeHero } from "@/components/storefront/home-hero";
import { buildOrganizationJsonLd } from "@/lib/seo";
import { StorefrontContainer } from "@/components/storefront/ui/storefront-container";
import { StorefrontSection } from "@/components/storefront/ui/storefront-section";
import { StorefrontLinkButton } from "@/components/storefront/ui/storefront-button";
import { ProductGrid } from "@/components/storefront/ui/product-grid";

const CATEGORIES = [
  {
    title: "Silk Sarees",
    subtitle: "Banarasi, Kanjivaram, Tussar",
    href: "/shop?productCode=silk",
    cta: "Explore Silk",
    image: "/category-silk.jpg",
    alt: "Woman wearing a maroon and gold silk Banarasi saree",
    objectPosition: "center top",
  },
  {
    title: "Cotton Collections",
    subtitle: "Mulmul, Chanderi, Kota Doria",
    href: "/shop?productCode=cotton",
    cta: "Explore Cotton",
    image: "/category-cotton.jpg",
    alt: "Woman wearing a light pink floral cotton saree",
    objectPosition: "center top",
  },
  {
    title: "Handloom Weaves",
    subtitle: "Ikat, Jamdani, Maheshwari",
    href: "/shop?productCode=handloom",
    cta: "Explore Handloom",
    image: "/category-handloom.jpg",
    alt: "Red terracotta Ikat or Patola-style handloom saree draped on a wooden table with gold zari border",
  },
];

const HERITAGE_MAIN =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAfc7Le0wcxSSApeQ8zwXuSKFROZCvftSElWBcuQ980PCBA5VDXr8NKEt3l9kDn5vDY1RbY7AvcS31gihfsyC2UIDfC26gpx8DWdur5rFNCDPKYz_qvKScrkcMZBHnlP67K5OfxLF46APvwPbpmbN1NAedyz1NJLaRrok18YyXXqyBTZy3TcqrZrqQ_4kT3gbQFwVisT6r2CFeUbaDccxgyIqXg7b8GVZLGz83anwuzWUpVQibreU3VOA";

const HERITAGE_DETAIL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCBCaBEYPFTshY0rYuTZ39OHjpOXX1OmfzgktLGaRX6hSbF9ggGmwX3ADem9G6Aj3FujqrySu7XCsmPlB0q6u6IXgkgLUm9X8Gxg9IhUFUYGqOA-cMxKCbLTp8Qv9bA1pngNYtBBMXi-1rMLLtmkxxSo5BSveYuoYMeMEyaOwzUlwWCffHTlCLqHL-tiz2yAdbfGykGlCS2diqiXaTIOpNLHtT6SDyIV3K1zpsvvsehixovgwdEkzPtYQ";

export default async function HomePage() {
  const featured = await prisma.product.findMany({
    where: { isPublished: true },
    include: { images: { orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
    take: 4,
  });
  const orgJsonLd = buildOrganizationJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      <div className="flex w-full flex-col">
        <HomeHero />

        <section className="relative z-20 w-full bg-surface-container-lowest py-space-lg shadow-sm">
          <StorefrontContainer>
            <div className="grid grid-cols-1 items-center gap-space-lg md:grid-cols-2 lg:gap-space-2xl">
              <div className="flex items-center gap-space-md rounded-xl bg-primary/10 p-space-sm">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Truck className="size-icon-md" />
                </div>
                <div className="min-w-0 flex flex-col">
                  <span className="font-headline-sm text-headline-sm leading-snug tracking-wide text-primary">
                    Free Shipping
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    On orders above ₹5,000
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-space-md rounded-xl bg-primary/10 p-space-sm">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ShieldCheck className="size-icon-md" />
                </div>
                <div className="min-w-0 flex flex-col">
                  <span className="font-headline-sm text-headline-sm leading-snug tracking-wide text-primary">
                    Pan-India Delivery
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Shipped securely across India
                  </span>
                </div>
              </div>
            </div>
          </StorefrontContainer>
        </section>

        <StorefrontSection background="surface" padding="lg">
          <div className="mx-auto mb-space-2xl flex max-w-2xl flex-col items-center text-center">
            <span className="mb-space-2xs font-label-eyebrow text-label-eyebrow font-bold tracking-[0.2em] text-secondary uppercase">
              Curated Silhouettes
            </span>
            <h2 className="font-headline-xl text-headline-xl-mobile font-medium tracking-wide text-primary md:text-headline-xl">
              Shop by Category
            </h2>
            <p className="mt-space-xs font-body-md text-body-md text-on-surface-variant">
              Handcrafted weaves celebrating regional textile traditions across India
            </p>
          </div>
          <div className="grid grid-cols-1 gap-space-lg md:grid-cols-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.title}
                href={cat.href}
                className="group relative block aspect-[3/4] overflow-hidden rounded bg-surface-container-high shadow-sm"
              >
                <Image
                  src={cat.image}
                  alt={cat.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105${
                    "objectPosition" in cat ? " origin-top" : ""
                  }`}
                  style={
                    "objectPosition" in cat
                      ? { objectPosition: cat.objectPosition }
                      : undefined
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent opacity-85 transition-opacity group-hover:opacity-90" />
                <div className="absolute inset-x-6 bottom-8 flex flex-col items-center text-center">
                  <div className="w-full max-w-[280px] rounded bg-primary/70 px-space-md py-space-sm shadow-md backdrop-blur-md">
                    <h3 className="mb-1 font-headline-md text-headline-md font-semibold text-tertiary-fixed">
                      {cat.title}
                    </h3>
                    <p className="font-body-sm text-body-sm font-light tracking-wide text-surface-variant/90">
                      {cat.subtitle}
                    </p>
                  </div>
                  <span className="mt-space-sm flex translate-y-2 items-center gap-1 font-label-eyebrow text-label-eyebrow tracking-widest text-tertiary-fixed uppercase opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    {cat.cta} <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </StorefrontSection>

        <StorefrontSection background="surface-low" padding="lg">
          <div className="mb-space-2xl flex flex-col justify-between gap-space-sm md:flex-row md:items-end">
            <div>
              <span className="font-label-eyebrow text-label-eyebrow font-bold tracking-[0.2em] text-secondary uppercase">
                The Latest Showcase
              </span>
              <h2 className="mt-1 font-headline-xl text-headline-xl-mobile font-medium tracking-wide text-primary md:text-headline-xl">
                New Arrivals
              </h2>
            </div>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-space-xs font-label-button text-label-button font-bold tracking-wider text-primary uppercase transition-colors hover:text-primary-container"
            >
              <span>View All Collection</span>
              <ArrowRight className="size-icon-sm transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          {featured.length === 0 ? (
            <p className="py-12 text-center text-on-surface-variant">
              New sarees will appear here once the collection is published.
            </p>
          ) : (
            <ProductGrid>
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ProductGrid>
          )}
        </StorefrontSection>

        <StorefrontSection background="surface" padding="xl">
          <div className="grid grid-cols-1 items-center gap-space-2xl lg:grid-cols-12">
            <div className="relative overflow-hidden lg:col-span-6 lg:overflow-visible">
              <div className="relative aspect-[4/5] overflow-hidden rounded bg-surface-container-high shadow-xl">
                <Image
                  src={HERITAGE_MAIN}
                  alt="Artisan hand-weaving silk on a traditional pit loom"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
              </div>
              <div className="absolute -right-4 -bottom-4 hidden aspect-square w-[min(50%,280px)] overflow-hidden rounded bg-surface-container-highest shadow-2xl sm:block lg:-right-8 lg:-bottom-8">
                <Image
                  src={HERITAGE_DETAIL}
                  alt="Close up of golden zari embroidery on maroon silk"
                  fill
                  sizes="25vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col items-start lg:col-span-6 lg:pl-space-xl">
              <span className="mb-space-2xs font-label-eyebrow text-label-eyebrow font-bold tracking-[0.24em] text-secondary uppercase">
                Our Philosophy
              </span>
              <h2 className="font-display-hero text-headline-xl-mobile font-medium tracking-wide text-primary md:text-headline-xl">
                The RR Vastras Heritage
              </h2>
              <div className="my-space-md h-0.5 w-16 bg-tertiary-fixed-dim" />
              <p className="mb-space-md font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
                RR Vastras was founded on an unapologetic reverence for authentic handloom artistry, reimagined for the modern woman who treasures effortless grace. We eschew heavy, burdensome bridal weight in favor of fluid, breathable drapes that honor ancient Indian weaving lineages without feeling like a costume.
              </p>
              <p className="mb-space-xl font-body-md text-body-md leading-relaxed text-on-surface-variant/90">
                From the quiet morning temple visit to festive evening soirees and corporate boardroom authority, our curated sarees celebrate your personal aura. Every yard of silk and cotton is sourced directly from certified master weaver clusters in Varanasi, Kanchipuram, Chanderi, and Bengal.
              </p>
              <StorefrontLinkButton href="/about" className="gap-space-xs">
                <span>Read Our Story</span>
                <ArrowRight className="size-icon-sm transition-transform group-hover:translate-x-1" />
              </StorefrontLinkButton>
            </div>
          </div>
        </StorefrontSection>

        <StorefrontSection
          background="surface-container"
          padding="xl"
          width="reading"
          containerClassName="max-w-reading"
        >
          <div className="mx-auto mb-space-2xl max-w-xl text-center">
            <span className="font-label-eyebrow text-label-eyebrow font-bold tracking-[0.2em] text-secondary uppercase">
              Have Questions?
            </span>
            <h2 className="mt-1 font-headline-xl text-headline-xl-mobile font-medium tracking-wide text-primary md:text-headline-xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-space-2xs font-body-md text-body-md text-on-surface-variant">
              Everything you need to know about our authentic weaves, delivery, and guarantees
            </p>
          </div>
          <HomeFaq />
        </StorefrontSection>
      </div>
    </>
  );
}
