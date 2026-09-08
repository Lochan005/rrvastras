import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandMark({
  compact = false,
  inverted = false,
}: {
  compact?: boolean;
  inverted?: boolean;
}) {
  return (
    <Link href="/" className="flex items-center gap-space-sm">
      <div
        className={cn(
          "flex items-center justify-center rounded border font-headline-md font-semibold tracking-wider",
          compact ? "h-8 w-8 text-headline-sm" : "h-9 w-9 text-headline-md",
          inverted
            ? "border-tertiary-fixed-dim/40 bg-primary-container text-tertiary-fixed"
            : "border-tertiary-fixed-dim/30 bg-primary text-tertiary-fixed"
        )}
      >
        RR
      </div>
      {compact ? (
        <span className="font-headline-md text-headline-md font-semibold uppercase tracking-[0.16em] text-surface-container-lowest">
          RR Vastras
        </span>
      ) : (
        <div className="hidden flex-col lg:flex">
          <span className="font-headline-sm text-headline-sm font-bold uppercase leading-none tracking-[0.18em] text-primary">
            RR Vastras
          </span>
          <span className="mt-0.5 font-label-eyebrow text-[9px] uppercase tracking-[0.25em] text-outline">
            Handloom Sarees
          </span>
        </div>
      )}
    </Link>
  );
}
