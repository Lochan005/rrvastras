import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShopPaginationProps {
  page: number;
  pageCount: number;
  shown: number;
  total: number;
  baseParams: Record<string, string | undefined>;
}

function hrefFor(page: number, baseParams: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  Object.entries(baseParams).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

export function ShopPagination({
  page,
  pageCount,
  shown,
  total,
  baseParams,
}: ShopPaginationProps) {
  if (total === 0) return null;

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  const progress = Math.min(100, Math.round((page / pageCount) * 100));

  return (
    <div className="mt-space-xl flex flex-col items-center justify-between gap-space-md rounded bg-surface-container-low p-space-lg pt-space-xl md:flex-row">
      <div className="flex flex-col gap-1">
        <span className="font-body-sm text-body-sm font-medium text-on-surface">
          Showing {shown} of {total} creation{total === 1 ? "" : "s"}
        </span>
        <div className="h-1.5 w-48 overflow-hidden rounded-full bg-surface-container-highest">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      {pageCount > 1 && (
        <div className="flex items-center gap-space-2xs">
          {page <= 1 ? (
            <span className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded bg-surface-container text-outline">
              <ChevronLeft className="h-5 w-5" />
            </span>
          ) : (
            <Link
              href={hrefFor(page - 1, baseParams)}
              className="flex h-10 w-10 items-center justify-center rounded bg-surface-container text-on-surface transition-colors hover:bg-surface-container-highest"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
          )}
          {pages.map((n) => (
            <Link
              key={n}
              href={hrefFor(n, baseParams)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded font-label-button text-label-button transition-colors",
                n === page
                  ? "bg-primary font-bold text-on-primary shadow-xs"
                  : "bg-surface-container text-on-surface hover:bg-surface-container-highest"
              )}
            >
              {n}
            </Link>
          ))}
          {page >= pageCount ? (
            <span className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded bg-surface-container text-outline">
              <ChevronRight className="h-5 w-5" />
            </span>
          ) : (
            <Link
              href={hrefFor(page + 1, baseParams)}
              className="flex h-10 w-10 items-center justify-center rounded bg-surface-container text-on-surface transition-colors hover:bg-surface-container-highest"
              aria-label="Next page"
            >
              <ChevronRight className="h-5 w-5" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
