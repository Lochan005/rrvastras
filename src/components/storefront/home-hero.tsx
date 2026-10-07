import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { StorefrontContainer } from "./ui/storefront-container";
import { StorefrontLinkButton } from "./ui/storefront-button";

const HERO_IMAGE_MOBILE = "/hero-mobile.jpg";
const HERO_IMAGE_DESKTOP = "/hero-desktop.jpg";

export function HomeHero() {
  return (
    <section className="relative w-full overflow-hidden bg-hero-bg">
      <div className="relative grid min-h-0 w-full grid-cols-1 grid-rows-1">
        {/* Media layer */}
        <div className="relative col-start-1 row-start-1 aspect-[2/3] w-full md:aspect-auto md:min-h-[min(72vh,820px)]">
          <Image
            src={HERO_IMAGE_MOBILE}
            alt="Woman in a maroon and gold Banarasi saree in a palace courtyard"
            fill
            priority
            sizes="100vw"
            className="object-cover object-top md:hidden"
          />
          <Image
            src={HERO_IMAGE_DESKTOP}
            alt="Woman in a maroon and gold Banarasi saree in a palace courtyard"
            fill
            priority
            sizes="100vw"
            className="hidden object-cover object-top md:block"
          />
        </div>

        {/* Localized scrims */}
        <div
          className="pointer-events-none z-[1] col-start-1 row-start-1 h-full w-full md:hidden"
          style={{
            background:
              "linear-gradient(to top, rgba(58, 1, 14, 0.92) 0%, rgba(58, 1, 14, 0.58) 38%, rgba(58, 1, 14, 0.16) 68%, transparent 88%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none z-[1] col-start-1 row-start-1 hidden h-full w-full md:block"
          aria-hidden
        >
          <div
            className="absolute inset-x-0 bottom-0 h-[clamp(200px,42%,400px)]"
            style={{
              background:
                "linear-gradient(to top, rgba(58, 1, 14, 0.82) 0%, rgba(58, 1, 14, 0.38) 46%, transparent 100%)",
            }}
          />
          <div
            className="absolute inset-y-0 left-0 w-[min(58%,720px)]"
            style={{
              background:
                "linear-gradient(to right, rgba(58, 1, 14, 0.76) 0%, rgba(58, 1, 14, 0.28) 58%, transparent 100%)",
            }}
          />
        </div>

        <div
          className="pointer-events-none absolute -right-24 -bottom-24 hidden h-96 w-96 rounded-full bg-tertiary-fixed/5 blur-3xl lg:block"
          aria-hidden
        />

        {/* Content layer */}
        <div className="relative z-10 col-start-1 row-start-1 flex flex-col justify-end pb-space-lg pt-space-md md:min-h-[min(72vh,820px)] lg:pb-space-2xl lg:pt-space-2xl">
          <StorefrontContainer className="flex flex-col items-start">
            <div className="mb-space-sm inline-flex max-w-full items-center gap-space-xs rounded-full bg-surface-container-lowest/10 px-space-sm py-1 shadow-sm backdrop-blur-md">
              <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-tertiary-fixed" />
              <span className="font-label-eyebrow text-label-eyebrow tracking-[0.12em] text-tertiary-fixed uppercase">
                Pure Banaras, Viscose, Assam Silk and more
              </span>
            </div>
            <h1 className="mb-space-sm max-w-2xl font-serif font-display-hero text-display-hero-mobile font-semibold tracking-[0.03em] text-surface-container-lowest lg:mb-space-md lg:text-display-hero">
              Shop Your Vibe
            </h1>
            <p className="mb-space-md max-w-xl font-body-lg text-body-lg leading-snug font-light text-surface-variant/90 lg:mb-space-xl lg:leading-relaxed">
              Handpicked sarees chosen with care — for celebrations, quiet days, and the life in between.
            </p>
            <StorefrontLinkButton href="/shop" variant="gold" className="gap-space-xs">
              <span>Explore Collection</span>
              <ArrowRight className="size-icon-sm shrink-0" aria-hidden />
            </StorefrontLinkButton>
            <div className="mt-space-md flex flex-wrap items-center gap-space-lg pt-space-xs text-tertiary-fixed lg:mt-space-2xl lg:gap-space-2xl lg:pt-space-md">
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md leading-none font-semibold text-surface-container-lowest">
                  100%
                </span>
                <span className="mt-1 font-label-eyebrow text-label-eyebrow tracking-widest text-surface-variant/70 uppercase">
                  Authentic Weave
                </span>
              </div>
              <div className="h-7 w-px shrink-0 bg-surface-variant/20" />
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md leading-none font-semibold text-surface-container-lowest">
                  Pan-India
                </span>
                <span className="mt-1 font-label-eyebrow text-label-eyebrow tracking-widest text-surface-variant/70 uppercase">
                  Secure Transit
                </span>
              </div>
            </div>
          </StorefrontContainer>
        </div>
      </div>
    </section>
  );
}
