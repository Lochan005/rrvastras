import Link from "next/link";
import Image from "next/image";
import type { Product, ProductImage } from "@prisma/client";
import { cn, formatINR } from "@/lib/utils";
import { WishlistButton } from "./wishlist-button";

type ProductWithImages = Product & { images: ProductImage[] };

interface ProductCardProps {
  product: ProductWithImages;
}

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images[0];
  const isOut = product.stock <= 0;
  const isNew =
    Date.now() - new Date(product.createdAt).getTime() <
    1000 * 60 * 60 * 24 * 21;

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded bg-surface-container-lowest shadow-sm transition-transform duration-300",
        isOut ? "opacity-75" : "hover:-translate-y-1"
      )}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-container">
        <Link href={`/shop/${product.slug}`} className="absolute inset-0">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className={cn(
                "object-cover transition-transform duration-500",
                isOut ? "grayscale-[30%]" : "group-hover:scale-105"
              )}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-on-surface-variant">
              No image
            </div>
          )}
        </Link>

        {isOut && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-on-surface/10 backdrop-blur-[1px]">
            <span className="rounded bg-error px-space-md py-1 font-label-badge text-label-badge font-bold tracking-widest text-on-error uppercase shadow-md">
              Out of Stock
            </span>
          </div>
        )}

        {!isOut && (
          <div className="absolute top-space-sm left-space-sm z-10 flex flex-col items-start gap-1">
            {isNew && (
              <span className="rounded bg-primary px-space-xs py-0.5 font-label-badge text-label-badge font-bold tracking-wider text-on-primary uppercase shadow-xs">
                New
              </span>
            )}
            <span className="rounded bg-surface-bright/90 px-space-xs py-0.5 font-label-badge text-[10px] font-semibold tracking-wide text-secondary uppercase backdrop-blur-xs">
              {product.fabric}
            </span>
          </div>
        )}

        <WishlistButton productId={product.id} variant="card" />
      </div>

      <Link
        href={`/shop/${product.slug}`}
        className="flex flex-1 flex-col justify-between gap-space-xs p-space-md"
      >
        <div>
          <span className="font-label-eyebrow text-label-eyebrow tracking-widest text-outline uppercase">
            {product.fabric}
          </span>
          <h3
            className={cn(
              "font-headline-sm text-headline-sm mt-0.5 truncate transition-colors",
              isOut
                ? "text-on-surface-variant"
                : "text-on-surface group-hover:text-primary"
            )}
          >
            {product.name}
          </h3>
        </div>
        <div className="flex items-end justify-between gap-space-xs pt-space-xs">
          <span
            className={cn(
              "font-price-lg text-price-lg",
              isOut ? "text-outline" : "text-primary"
            )}
          >
            {formatINR(product.priceInPaise)}
          </span>
          {isOut ? (
            <span className="rounded bg-surface-variant px-space-xs py-0.5 font-label-badge text-[10px] font-semibold text-on-surface-variant uppercase">
              Restocking Soon
            </span>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
