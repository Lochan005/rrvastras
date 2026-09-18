import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/storefront/product-card";

export default async function WishlistPage() {
  const session = await requireAuth();

  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: { images: { orderBy: { sortOrder: "asc" } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto w-full max-w-[1360px] px-gutter-mobile pt-space-md pb-space-4xl lg:px-gutter-desktop">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-space-xs pb-space-lg font-body-sm text-body-sm text-on-surface-variant"
      >
        <Link href="/" className="flex items-center gap-1 hover:text-primary">
          <Home className="h-4 w-4" />
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-outline" />
        <Link href="/account" className="hover:text-primary">
          My Account
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-outline" />
        <span className="font-semibold text-primary">Wishlist</span>
      </nav>

      <span className="font-label-eyebrow text-label-eyebrow font-bold tracking-[0.25em] text-primary uppercase">
        Handpicked Stash
      </span>
      <h1 className="font-headline-xl text-headline-xl-mobile mt-space-2xs tracking-wide text-primary md:text-headline-xl">
        My Wishlist
      </h1>
      <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
        {items.length} saved treasure{items.length === 1 ? "" : "s"}
      </p>

      {items.length === 0 ? (
        <div className="mt-space-2xl rounded-xl bg-surface-container-low px-space-lg py-16 text-center">
          <p className="font-headline-sm text-headline-sm text-primary">
            Your wishlist is empty.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex rounded bg-primary px-space-xl py-space-md font-label-button text-label-button tracking-wider text-on-primary uppercase"
          >
            Browse Sarees
          </Link>
        </div>
      ) : (
        <div className="mt-space-2xl grid grid-cols-1 gap-space-lg sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <ProductCard
              key={item.id}
              product={item.product}
            />
          ))}
        </div>
      )}
    </div>
  );
}
