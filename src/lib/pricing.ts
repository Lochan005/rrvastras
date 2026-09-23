export const PRODUCT_SHIPPING_DURATION = "5–7 days";
export const PRODUCT_SHIPPING_COPY = `Delivery within ${PRODUCT_SHIPPING_DURATION}`;
export const SALE_RETURN_NOTE =
  "Please Note: Products purchased during the sale period are not eligible for return, exchange or refund.";

export function getDiscountPercent(
  compareAtPriceInPaise: number | null | undefined,
  priceInPaise: number
): number | null {
  if (
    compareAtPriceInPaise == null ||
    compareAtPriceInPaise <= 0 ||
    priceInPaise < 0 ||
    compareAtPriceInPaise <= priceInPaise
  ) {
    return null;
  }

  const percent = Math.round(
    ((compareAtPriceInPaise - priceInPaise) / compareAtPriceInPaise) * 100
  );
  return percent > 0 ? percent : null;
}

export function rupeesToPaise(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const amount = Number(trimmed);
  if (!Number.isFinite(amount) || amount < 0) return null;
  return Math.round(amount * 100);
}

export function paiseToRupeesInput(paise: number | null | undefined): string {
  if (paise == null) return "";
  return String(Math.round(paise / 100));
}
