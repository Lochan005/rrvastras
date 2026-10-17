import type { Prisma } from "@prisma/client";
import type { ProductListPriority } from "@prisma/client";

export const PRODUCT_LIST_PRIORITIES: ProductListPriority[] = [
  "high",
  "medium",
  "low",
];

export const PRODUCT_LIST_PRIORITY_LABELS: Record<ProductListPriority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

/** High → medium → low, then the shopper's chosen sort within each band. */
export function storefrontProductOrderBy(
  sort?: string
): Prisma.ProductOrderByWithRelationInput[] {
  const secondary: Prisma.ProductOrderByWithRelationInput =
    sort === "price-asc"
      ? { priceInPaise: "asc" }
      : sort === "price-desc"
        ? { priceInPaise: "desc" }
        : { createdAt: "desc" };

  return [{ listPriority: "asc" }, secondary];
}

export function parseProductListPriority(value: unknown): ProductListPriority {
  if (value === "high" || value === "medium" || value === "low") {
    return value;
  }
  return "medium";
}
