import type { Metadata } from "next";
import Image from "next/image";
import { StorefrontContainer } from "@/components/storefront/ui/storefront-container";
import { PageHeader } from "@/components/storefront/ui/page-header";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about RR Vastras — a women's saree brand offering elegant traditional and contemporary sarees across India.",
};

export default function AboutPage() {
  return (
    <StorefrontContainer width="reading" className="py-space-3xl lg:py-space-4xl">
      <PageHeader
        title="Our Story"
        align="center"
        description="RR Vastras celebrates the saree with curated weaves for everyday grace and special moments."
      />
      <div className="mx-auto mb-space-2xl aspect-[16/10] w-full max-w-reading overflow-hidden rounded bg-surface-container-high">
        <Image
          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1200"
          alt="RR Vastras collection"
          width={1200}
          height={750}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="mx-auto max-w-reading space-y-space-lg font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
        <p className="text-center font-body-lg text-body-lg font-medium text-on-surface">
          RR Vastras is a women&apos;s clothing brand dedicated to the timeless
          elegance of the saree. We curate sarees that celebrate tradition while
          embracing modern sensibilities.
        </p>
        <p>
          Every saree in our collection includes a matching blouse piece, so you
          can drape and wear with confidence. From luxurious silks to breathable
          cottons and handloom weaves, we source quality fabrics that drape
          beautifully and feel comfortable.
        </p>
        <p>
          Based in India, we ship nationwide. Our team personally handles every
          order — from careful packing to dispatch — ensuring your saree arrives
          in perfect condition.
        </p>
        <p>
          Whether you&apos;re building your first saree collection or adding a
          statement piece for a special occasion, RR Vastras is here to help you
          find something truly special.
        </p>
      </div>
    </StorefrontContainer>
  );
}
