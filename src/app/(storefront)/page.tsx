import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Shirt, Truck } from "lucide-react";
import { prisma } from "@/lib/db";
import { getStoreSettings } from "@/lib/store";
import { ProductCard } from "@/components/storefront/product-card";
import { HomeFaq } from "@/components/storefront/home-faq";
import { buildOrganizationJsonLd } from "@/lib/seo";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAPvFvnsrLCcTzcMY0lBxjEbwstPmdtuUib8Lx9fAkT5lJPrOGADSubywFNAPQN5RZJJ_d-ukgBzve90BVqzVSoS4qQv-zAKR0Nq9bOrQOoRN17oEs38o4QBF2-rtwpwjS8jMqI2XyCDl12usNn88JKnACd31wwROaJsp2AS3-wVOdoDo-Q3UP8M8VWIbL6gRPvukwe68ggZLtpRbE-wRklf8pkPY95dDoTXCzVQLioRSRi4KlpArQyPw";

const CATEGORIES = [
  {
    title: "Silk Sarees",
    subtitle: "Banarasi, Kanjivaram, Tussar",
    href: "/shop?fabric=silk",
    cta: "Explore Silk",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAj9vmRYVTxO54APrDp8FzRD_MGhorFc37qBMHsfge8uyb5-ptLRHNegSjnxDkkA5EpOaUf3aR6NdCxmxjvs93yK56R_FolyWj20yqXUB4h4dLU7AlbKN79ogOn7g7rqvTZNVBmosYOh6_XFYs8ZCjUhWK1zvFw2fJaGizPO_X_QdgfTwtlEUY5PNUXgtMoeQdCxAU5ZjOKiXyNct0tEO4_hw-v1Hw7GXYaIUtvAiZGZwtBGxbpVK0njA",
    alt: "Luxurious silk saree with detailed zari work",
  },
  {
    title: "Cotton Collections",
    subtitle: "Mulmul, Chanderi, Kota Doria",
    href: "/shop?fabric=cotton",
    cta: "Explore Cotton",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAQUhJv58QVA0F-iIAEy5fwtPOUMTE_ILBps90ws0ss8sDptc3cPaymUQwz2xvv_izlEcDbs_kn0rUilijXqnA8vKgLGQLOWoTauCGHQKPqf5rnpDV2EWzUcxk3_LlOWvsuEhbjpkJN-1X2NwXPwI7cE2oIZziFHc0jGTQ9vRa8MMQhLKVSAopUXkhqtj3Q3QXSJQjVK80ohlf_qPY6jqeE7KlL4542Il-sdfQ1DitQeZS9zQfyl0JGAw",
    alt: "Handloom cotton saree with delicate woven floral motifs",
  },
  {
    title: "Handloom Weaves",
    subtitle: "Ikat, Jamdani, Maheshwari",
    href: "/shop?fabric=handloom",
    cta: "Explore Handloom",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDQi1IjHBwCKr61bL_i0WoZWQ16VxY_fCJC10ih4veA1OhIjdVEUKHsahwpUB-q1Qhr5PM5mFdiEZtrEN51oWBWHvhZwvN3WJpiDSTmdSM_IBu_GYf2-ZmTB0MsqWLeqIWKkuMXUr_Wx_HMKQhgBXvbRTto5nETZ59LtaPOe7EIwB7wI-1dRk-BBJRYjgHFFmu5X90LWbN_trbx02xBkxZS5KFDP96Cprr_w_Rs-G0Zda6J_oXHAUAvYQ",
    alt: "Artisanal handloom saree with Ikat geometric patterns",
  },
];

const HERITAGE_MAIN =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAfc7Le0wcxSSApeQ8zwXuSKFROZCvftSElWBcuQ980PCBA5VDXr8NKEt3l9kDn5vDY1RbY7AvcS31gihfsyC2UIDfC26gpx8DWdur5rFNCDPKYz_qvKScrkcMZBHnlP67K5OfxLF46APvwPbpmbN1NAedyz1NJLaRrok18YyXXqyBTZy3TcqrZrqQ_4kT3gbQFwVisT6r2CFeUbaDccxgyIqXg7b8GVZLGz83anwuzWUpVQibreU3VOA";

const HERITAGE_DETAIL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCBCaBEYPFTshY0rYuTZ39OHjpOXX1OmfzgktLGaRX6hSbF9ggGmwX3ADem9G6Aj3FujqrySu7XCsmPlB0q6u6IXgkgLUm9X8Gxg9IhUFUYGqOA-cMxKCbLTp8Qv9bA1pngNYtBBMXi-1rMLLtmkxxSo5BSveYuoYMeMEyaOwzUlwWCffHTlCLqHL-tiz2yAdbfGykGlCS2diqiXaTIOpNLHtT6SDyIV3K1zpsvvsehixovgwdEkzPtYQ";

export default async function HomePage() {
  const settings = await getStoreSettings();
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
        <section className="relative -mt-[92px] flex min-h-[600px] h-[82vh] w-full items-center justify-start overflow-hidden bg-primary pt-[92px] lg:-mt-[104px] lg:pt-[104px]">
          <div
            className="absolute inset-0 h-full w-full scale-105 bg-cover bg-center"
            style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
            role="img"
            aria-label="Editorial portrait of a woman draped in a crimson and gold silk saree"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent opacity-95" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-primary/30" />
          <div className="pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-tertiary-fixed/5 blur-3xl" />

          <div className="relative z-10 mx-auto flex w-full max-w-[1360px] flex-col items-start justify-center px-gutter-mobile py-space-2xl lg:px-gutter-desktop">
            <div className="mb-space-md inline-flex items-center gap-space-xs rounded-full bg-surface-container-lowest/10 px-space-sm py-1 shadow-sm backdrop-blur-md">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-tertiary-fixed" />
              <span className="font-label-eyebrow text-[10px] tracking-[0.2em] text-tertiary-fixed uppercase">
                Pure Mulberry &amp; Chanderi Weaves
              </span>
            </div>
            <p className="mb-space-xs font-label-eyebrow text-label-eyebrow font-semibold tracking-[0.24em] text-tertiary-fixed uppercase">
              New Collection
            </p>
            <h1 className="mb-space-md max-w-2xl font-display-hero text-display-hero-mobile font-medium tracking-[0.03em] text-surface-container-lowest md:text-display-hero">
              Shop Your Vibe
            </h1>
            <p className="mb-space-xl max-w-xl font-body-lg text-body-lg leading-relaxed font-light text-surface-variant/90">
              Discover curated sarees in silk, cotton, and handloom weaves. Crafted for celebrations, everyday grace, and everything in between.
            </p>
            <div className="flex flex-wrap items-center gap-space-md">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-space-xs rounded bg-tertiary-fixed px-space-xl py-space-md font-label-button text-label-button font-bold tracking-wider text-primary uppercase shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-tertiary-fixed-dim"
              >
                <span>Explore Collection</span>
                <ArrowRight className="h-[18px] w-[18px]" />
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded bg-surface-container-lowest/10 px-space-lg py-space-md font-label-button text-label-button tracking-wider text-surface-container-lowest uppercase backdrop-blur-md transition-colors duration-300 hover:bg-surface-container-lowest/20"
              >
                Festive &amp; Casual
              </Link>
            </div>
            <div className="mt-space-2xl flex items-center gap-space-2xl pt-space-md text-tertiary-fixed">
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md leading-none font-semibold text-surface-container-lowest">
                  100%
                </span>
                <span className="mt-1 font-label-eyebrow text-[10px] tracking-widest text-surface-variant/70 uppercase">
                  Authentic Weave
                </span>
              </div>
              <div className="h-7 w-px bg-surface-variant/20" />
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md leading-none font-semibold text-surface-container-lowest">
                  Free
                </span>
                <span className="mt-1 font-label-eyebrow text-[10px] tracking-widest text-surface-variant/70 uppercase">
                  Matching Blouse
                </span>
              </div>
              <div className="h-7 w-px bg-surface-variant/20 hidden sm:block" />
              <div className="hidden flex-col sm:flex">
                <span className="font-headline-md text-headline-md leading-none font-semibold text-surface-container-lowest">
                  Pan-India
                </span>
                <span className="mt-1 font-label-eyebrow text-[10px] tracking-widest text-surface-variant/70 uppercase">
                  Secure Transit
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-20 w-full bg-primary-container py-space-lg text-surface-container-lowest shadow-md">
          <div className="mx-auto max-w-[1360px] px-gutter-mobile lg:px-gutter-desktop">
            <div className="grid grid-cols-1 items-center gap-space-lg md:grid-cols-3 lg:gap-space-2xl">
              <div className="flex items-center gap-space-md rounded bg-primary/20 p-space-sm backdrop-blur-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-tertiary-fixed/15 text-tertiary-fixed">
                  <Truck className="h-[26px] w-[26px]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm leading-snug tracking-wide text-tertiary-fixed">
                    Free Shipping
                  </span>
                  <span className="font-body-sm text-body-sm text-surface-variant/80">
                    On orders above ₹7,500
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-space-md rounded bg-primary/20 p-space-sm backdrop-blur-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-tertiary-fixed/15 text-tertiary-fixed">
                  <Shirt className="h-[26px] w-[26px]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm leading-snug tracking-wide text-tertiary-fixed">
                    Blouse Included
                  </span>
                  <span className="font-body-sm text-body-sm text-surface-variant/80">
                    With every saree purchase
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-space-md rounded bg-primary/20 p-space-sm backdrop-blur-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-tertiary-fixed/15 text-tertiary-fixed">
                  <ShieldCheck className="h-[26px] w-[26px]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm leading-snug tracking-wide text-tertiary-fixed">
                    Pan-India Delivery
                  </span>
                  <span className="font-body-sm text-body-sm text-surface-variant/80">
                    Shipped securely across India
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full bg-surface py-space-3xl">
          <div className="mx-auto max-w-[1360px] px-gutter-mobile lg:px-gutter-desktop">
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
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent opacity-85 transition-opacity group-hover:opacity-90" />
                  <div className="absolute inset-x-6 bottom-8 flex flex-col items-center text-center">
                    <div className="w-full max-w-[280px] rounded bg-primary/70 px-space-md py-space-sm shadow-md backdrop-blur-md">
                      <h3 className="mb-1 font-headline-md text-headline-md font-semibold text-tertiary-fixed">
                        {cat.title}
                      </h3>
                      <p className="font-body-sm text-body-sm tracking-wide font-light text-surface-variant/90">
                        {cat.subtitle}
                      </p>
                    </div>
                    <span className="mt-space-sm flex translate-y-2 items-center gap-1 font-label-eyebrow text-[11px] tracking-widest text-tertiary-fixed uppercase opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      {cat.cta} <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full bg-surface-container-low py-space-3xl">
          <div className="mx-auto max-w-[1360px] px-gutter-mobile lg:px-gutter-desktop">
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
                <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            {featured.length === 0 ? (
              <p className="py-12 text-center text-on-surface-variant">
                New sarees will appear here once the collection is published.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-space-lg sm:grid-cols-2 lg:grid-cols-4">
                {featured.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    lowStockThreshold={settings.lowStockThreshold}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="w-full bg-surface py-space-4xl">
          <div className="mx-auto max-w-[1360px] px-gutter-mobile lg:px-gutter-desktop">
            <div className="grid grid-cols-1 items-center gap-space-2xl lg:grid-cols-12">
              <div className="relative lg:col-span-6">
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
                <div className="absolute -right-8 -bottom-8 hidden aspect-square w-1/2 overflow-hidden rounded bg-surface-container-highest shadow-2xl sm:block">
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
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-space-xs rounded bg-primary px-space-xl py-space-md font-label-button text-label-button tracking-wider text-surface-container-lowest uppercase shadow-md transition-all duration-300 hover:bg-primary-container"
                >
                  <span>Read Our Story</span>
                  <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full bg-surface-container py-space-4xl">
          <div className="mx-auto max-w-[960px] px-gutter-mobile lg:px-gutter-desktop">
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
          </div>
        </section>
      </div>
    </>
  );
}
