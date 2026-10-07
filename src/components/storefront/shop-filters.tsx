"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Diamond, SlidersHorizontal, X } from "lucide-react";
import { Drawer } from "vaul";
import { cn } from "@/lib/utils";

interface ShopFiltersProps {
  productCodes: { name: string; count: number }[];
  totalCount: number;
  inStockCount: number;
  currentProductCode?: string;
  currentSort?: string;
  currentPrice?: string;
  inStockOnly?: boolean;
}

function buildShopUrl(
  searchParams: URLSearchParams,
  key: string,
  value: string | null
) {
  const params = new URLSearchParams(searchParams.toString());
  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }
  params.delete("page");
  const qs = params.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

export function ShopFilters({
  productCodes,
  totalCount,
  inStockCount,
  currentProductCode,
  currentSort,
  currentPrice,
  inStockOnly,
}: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  function updateFilter(key: string, value: string | null) {
    router.push(buildShopUrl(searchParams, key, value));
  }

  const sidebar = (
    <aside className="flex w-full flex-shrink-0 flex-col gap-space-lg rounded bg-surface-container-low p-space-lg shadow-sm lg:sticky lg:sticky-below-header lg:w-[270px]">
      <div className="flex items-center justify-between pb-space-xs">
        <div className="flex items-center gap-space-xs">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          <span className="font-headline-sm text-headline-sm text-on-surface">
            Refine By
          </span>
        </div>
        <button
          type="button"
          className="font-label-button text-[12px] font-semibold tracking-wider text-primary uppercase hover:text-primary-container"
          onClick={() => router.push("/shop")}
        >
          Clear All
        </button>
      </div>

      <div className="flex flex-col gap-space-xs">
        <label className="font-label-eyebrow text-label-eyebrow tracking-wider text-outline uppercase">
          Sort Arrangement
        </label>
        <div className="relative">
          <select
            aria-label="Sort Collection"
            className="h-12 w-full cursor-pointer appearance-none rounded bg-surface-container-lowest py-2 pr-space-xl pl-space-md font-body-sm text-body-sm text-on-surface shadow-sm focus:outline-none"
            value={currentSort ?? "newest"}
            onChange={(e) =>
              updateFilter(
                "sort",
                e.target.value === "newest" ? null : e.target.value
              )
            }
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
          <span className="pointer-events-none absolute top-1/2 right-space-sm -translate-y-1/2 text-outline">
            ▾
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <span className="font-label-eyebrow text-label-eyebrow tracking-wider text-outline uppercase">
            Product Code
          </span>
          <span className="font-label-badge text-label-badge text-on-surface-variant">
            {productCodes.length} Code{productCodes.length === 1 ? "" : "s"}
          </span>
        </div>
        <div className="flex flex-col gap-space-xs font-body-sm text-body-sm text-on-surface">
          <label className="flex cursor-pointer items-center justify-between rounded p-space-xs hover:bg-surface">
            <span className="flex items-center gap-space-xs">
              <input
                type="radio"
                name="product_code_choice"
                checked={!currentProductCode}
                onChange={() => updateFilter("productCode", null)}
                className="h-4 w-4 cursor-pointer accent-primary"
              />
              <span>All codes</span>
            </span>
            <span className="text-xs text-outline">{totalCount}</span>
          </label>
          {productCodes.map((f) => (
            <label
              key={f.name}
              className="flex cursor-pointer items-center justify-between rounded p-space-xs hover:bg-surface"
            >
              <span className="flex items-center gap-space-xs">
                <input
                  type="radio"
                  name="product_code_choice"
                  checked={currentProductCode === f.name}
                  onChange={() => updateFilter("productCode", f.name)}
                  className="h-4 w-4 cursor-pointer accent-primary"
                />
                <span>{f.name}</span>
              </span>
              <span className="text-xs text-outline">{f.count}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-space-xs">
        <span className="font-label-eyebrow text-label-eyebrow tracking-wider text-outline uppercase">
          Availability
        </span>
        <label className="flex cursor-pointer items-center gap-space-xs rounded p-space-xs font-body-sm text-body-sm hover:bg-surface">
          <input
            type="checkbox"
            checked={inStockOnly ?? false}
            onChange={(e) =>
              updateFilter("inStock", e.target.checked ? "true" : null)
            }
            className="h-4 w-4 cursor-pointer rounded accent-primary"
          />
          <span className="font-medium text-on-surface">
            In stock only ({inStockCount})
          </span>
        </label>
      </div>

      <div className="flex flex-col gap-space-sm">
        <span className="font-label-eyebrow text-label-eyebrow tracking-wider text-outline uppercase">
          Price Range
        </span>
        <div className="flex flex-col gap-space-2xs">
          {[
            { value: "under-5000", label: "Under ₹5,000" },
            { value: "5000-10000", label: "₹5,000 - ₹10,000" },
            { value: "above-10000", label: "Above ₹10,000" },
          ].map((band) => (
            <button
              key={band.value}
              type="button"
              onClick={() =>
                updateFilter(
                  "price",
                  currentPrice === band.value ? null : band.value
                )
              }
              className={cn(
                "rounded px-space-sm py-space-xs text-left font-body-sm text-body-sm transition-colors",
                currentPrice === band.value
                  ? "bg-primary-fixed font-semibold text-on-primary-fixed"
                  : "bg-surface text-on-surface-variant hover:text-primary"
              )}
            >
              {band.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-space-xs rounded bg-surface-container p-space-sm text-on-surface-variant">
        <Diamond className="mt-0.5 h-[18px] w-[18px] shrink-0 text-tertiary-fixed-dim" />
        <p className="font-body-sm text-[12px] leading-relaxed">
          All silk creations are shipped with physical Silk Mark authorization
          seals and certified artisan weave tags.
        </p>
      </div>
    </aside>
  );

  return (
    <>
      <button
        type="button"
        className="mb-space-md inline-flex items-center gap-space-xs rounded bg-primary px-space-md py-space-sm font-label-button text-label-button tracking-wider text-on-primary uppercase lg:hidden"
        onClick={() => setOpen(true)}
      >
        <SlidersHorizontal className="h-4 w-4" />
        Refine By
      </button>
      <div className="hidden lg:block">{sidebar}</div>
      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm lg:hidden" />
          <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mt-24 flex max-h-[85vh] flex-col rounded-t-xl bg-surface-container-lowest outline-none lg:hidden">
            <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-outline-variant/60" />
            <div className="flex items-center justify-between border-b border-outline-variant/40 px-gutter-mobile py-space-md">
              <span className="font-headline-sm text-headline-sm text-on-surface">Refine By</span>
              <button
                type="button"
                aria-label="Close filters"
                className="p-space-2xs text-on-surface-variant"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto px-gutter-mobile pb-space-xl">{sidebar}</div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
