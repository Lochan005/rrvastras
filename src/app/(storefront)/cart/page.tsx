"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/providers/cart-provider";
import { formatINR } from "@/lib/utils";
import { StorefrontContainer } from "@/components/storefront/ui/storefront-container";
import { PageHeader } from "@/components/storefront/ui/page-header";
import { StorefrontEmptyState, StorefrontSkeleton } from "@/components/storefront/ui/storefront-states";
import { StorefrontLinkButton } from "@/components/storefront/ui/storefront-button";

export default function CartPage() {
  const { items, removeItem, count, hydrated } = useCart();

  if (!hydrated) {
    return (
      <StorefrontContainer className="py-space-2xl">
        <StorefrontSkeleton className="mb-space-lg h-10 w-72" />
        <div className="grid gap-space-xl lg:grid-cols-3">
          <div className="space-y-space-md lg:col-span-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <StorefrontSkeleton key={i} className="h-36 w-full" />
            ))}
          </div>
          <StorefrontSkeleton className="h-64 w-full" />
        </div>
      </StorefrontContainer>
    );
  }

  if (items.length === 0) {
    return (
      <StorefrontContainer className="py-space-4xl">
        <StorefrontEmptyState
          title="Your shopping bag is empty"
          description="Add sarees you love — they will stay here until you checkout."
          actionLabel="Continue shopping"
          actionHref="/shop"
        />
      </StorefrontContainer>
    );
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.priceInPaise * item.quantity,
    0
  );

  return (
    <StorefrontContainer className="py-space-2xl lg:py-space-3xl">
      <PageHeader title={`Your bag (${count} item${count === 1 ? "" : "s"})`} />

      <div className="grid gap-space-2xl lg:grid-cols-12">
        <div className="space-y-space-lg lg:col-span-7">
          {items.map((item) => (
            <article
              key={item.productId}
              className="flex gap-space-md border-b border-outline-variant/40 pb-space-lg sm:gap-space-lg"
            >
              <Link
                href={`/shop/${item.slug}`}
                className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded bg-surface-container sm:w-28"
              >
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center p-2 text-center font-body-sm text-body-sm text-on-surface-variant">
                    No image
                  </div>
                )}
              </Link>
              <div className="flex min-w-0 flex-1 flex-col justify-between gap-space-sm">
                <div className="flex items-start justify-between gap-space-md">
                  <div className="min-w-0">
                    <Link
                      href={`/shop/${item.slug}`}
                      className="line-clamp-2 font-headline-sm text-headline-sm text-on-surface transition-colors hover:text-primary"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                      {formatINR(item.priceInPaise)} each · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 font-price-md text-price-md text-on-surface">
                    {formatINR(item.priceInPaise * item.quantity)}
                  </p>
                </div>
                <button
                  type="button"
                  className="self-start font-body-sm text-body-sm text-on-surface-variant underline-offset-4 hover:text-error hover:underline"
                  onClick={() => removeItem(item.productId)}
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="lg:col-span-5">
          <div className="sticky-below-header rounded border border-outline-variant/40 bg-surface-container-low p-space-lg">
            <h2 className="mb-space-md font-headline-md text-headline-md text-primary">
              Order summary
            </h2>
            <div className="space-y-space-sm font-body-sm text-body-sm text-on-surface-variant">
              <div className="flex justify-between gap-space-md">
                <span>Subtotal</span>
                <span className="font-medium text-on-surface">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between gap-space-md">
                <span>Shipping</span>
                <span className="text-right">Calculated at checkout</span>
              </div>
            </div>
            <div className="mt-space-md border-t border-outline-variant/40 pt-space-md">
              <div className="flex justify-between font-price-lg text-price-lg text-on-surface">
                <span>Total</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                Inclusive of all taxes
              </p>
            </div>
            <StorefrontLinkButton href="/checkout" className="mt-space-lg w-full">
              Proceed to checkout
            </StorefrontLinkButton>
          </div>
        </div>
      </div>
    </StorefrontContainer>
  );
}
