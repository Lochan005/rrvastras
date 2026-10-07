"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import type { ProductSearchResult } from "@/app/api/search/route";
import { cn, formatINR } from "@/lib/utils";

async function fetchResults(
  query: string,
  signal?: AbortSignal
): Promise<ProductSearchResult[]> {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal });
  if (!res.ok) return [];
  const data: { results: ProductSearchResult[] } = await res.json();
  return data.results;
}

export function HeaderSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductSearchResult[]>([]);
  const [resultsFor, setResultsFor] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [notFound, setNotFound] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const trimmed = query.trim();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    setNotFound(false);
    setActiveIndex(-1);
    if (!trimmed) {
      setResults([]);
      setResultsFor("");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    const timer = setTimeout(() => {
      fetchResults(trimmed, controller.signal)
        .then((items) => {
          setResults(items);
          setResultsFor(trimmed);
        })
        .catch(() => {})
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 200);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed]);

  function goToProduct(slug: string) {
    setOpen(false);
    setQuery("");
    router.push(`/shop/${slug}`);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!trimmed) return;

    if (activeIndex >= 0 && results[activeIndex]) {
      goToProduct(results[activeIndex].slug);
      return;
    }

    const matches = resultsFor === trimmed ? results : await fetchResults(trimmed);
    if (matches.length > 0) {
      goToProduct(matches[0].slug);
    } else {
      setNotFound(true);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
    } else if (event.key === "ArrowDown" && results.length > 0) {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (event.key === "ArrowUp" && results.length > 0) {
      event.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    }
  }

  const showEmpty =
    trimmed && !loading && resultsFor === trimmed && results.length === 0;

  return (
    <div ref={panelRef} className="contents">
      <button
        type="button"
        aria-label="Search"
        aria-expanded={open}
        className="inline-flex p-space-2xs text-on-surface-variant transition-colors hover:text-primary"
        onClick={() => setOpen((value) => !value)}
      >
        <Search className="h-5 w-5" />
      </button>

      {open && (
        <div
          className="fixed top-site-header right-0 left-0 z-40 border-b border-outline-variant/40 bg-surface-container-lowest shadow-lg"
        >
          <div className="mx-auto max-w-form px-gutter-mobile py-space-md lg:px-gutter-desktop">
            <form onSubmit={handleSubmit} role="search" className="flex items-center gap-space-sm">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-outline" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search by saree name or product code"
                  aria-label="Search by saree name or product code"
                  aria-autocomplete="list"
                  aria-controls="header-search-results"
                  autoComplete="off"
                  className="h-11 w-full rounded border border-outline-variant bg-surface pr-9 pl-9 text-sm text-on-surface placeholder:text-outline focus:border-primary focus:outline-none"
                />
                {loading && (
                  <Loader2 className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin text-outline" />
                )}
              </div>
              <button
                type="submit"
                className="h-11 rounded bg-primary px-space-lg font-label-button text-label-button font-semibold tracking-wider text-on-primary uppercase transition-colors hover:bg-primary-container disabled:opacity-60"
                disabled={!trimmed}
              >
                Search
              </button>
              <button
                type="button"
                aria-label="Close search"
                className="p-space-2xs text-on-surface-variant hover:text-primary"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </form>

            {results.length > 0 && (
              <ul
                id="header-search-results"
                role="listbox"
                className="mt-space-sm max-h-[60vh] divide-y divide-outline-variant/40 overflow-y-auto rounded border border-outline-variant/60"
              >
                {results.map((item, index) => (
                  <li key={item.slug} role="option" aria-selected={index === activeIndex}>
                    <button
                      type="button"
                      onClick={() => goToProduct(item.slug)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={cn(
                        "flex w-full items-center gap-space-md px-space-md py-space-sm text-left transition-colors",
                        index === activeIndex ? "bg-surface-container-low" : "hover:bg-surface-container-low"
                      )}
                    >
                      <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded bg-surface-container">
                        {item.imageUrl && (
                          <Image
                            src={item.imageUrl}
                            alt=""
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-on-surface">{item.name}</p>
                        <p className="text-xs tracking-wide text-outline uppercase">{item.productCode}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-semibold text-on-surface">
                          {formatINR(item.priceInPaise)}
                        </p>
                        {!item.inStock && (
                          <p className="text-[10px] font-semibold text-error uppercase">Sold out</p>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {(showEmpty || notFound) && (
              <p className="mt-space-sm text-sm text-on-surface-variant">
                No sarees match &ldquo;{trimmed}&rdquo;. Try another name or product code.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
