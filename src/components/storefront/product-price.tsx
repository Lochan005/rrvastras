import { cn, formatINR } from "@/lib/utils";
import { getDiscountPercent } from "@/lib/pricing";

interface ProductPriceProps {
  priceInPaise: number;
  compareAtPriceInPaise?: number | null;
  muted?: boolean;
  size?: "card" | "detail";
  className?: string;
}

export function ProductPrice({
  priceInPaise,
  compareAtPriceInPaise,
  muted = false,
  size = "card",
  className,
}: ProductPriceProps) {
  const discountPercent = getDiscountPercent(
    compareAtPriceInPaise,
    priceInPaise
  );
  const showOffer = discountPercent != null && compareAtPriceInPaise != null;

  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-1", className)}>
      <span
        className={cn(
          size === "detail"
            ? "text-3xl font-medium"
            : "font-price-lg text-price-lg",
          muted ? "text-outline" : "text-primary"
        )}
      >
        {formatINR(priceInPaise)}
      </span>
      {showOffer ? (
        <>
          <span
            className={cn(
              "text-muted line-through",
              size === "detail" ? "text-lg font-normal" : "text-sm"
            )}
          >
            {formatINR(compareAtPriceInPaise)}
          </span>
          <span
            className={cn(
              "font-semibold text-error",
              size === "detail"
                ? "text-base"
                : "rounded bg-error-container px-1.5 py-0.5 font-label-badge text-[11px] leading-none"
            )}
          >
            {discountPercent}%
          </span>
        </>
      ) : null}
    </div>
  );
}
