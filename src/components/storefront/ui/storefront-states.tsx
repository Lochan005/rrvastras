import { cn } from "@/lib/utils";
import { StorefrontLinkButton } from "./storefront-button";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

export function StorefrontEmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded bg-surface-container-low px-space-lg py-space-3xl text-center",
        className
      )}
    >
      <h2 className="font-headline-md text-headline-md text-primary">{title}</h2>
      {description && (
        <p className="mt-space-sm max-w-form font-body-md text-body-md text-on-surface-variant">
          {description}
        </p>
      )}
      {actionLabel && actionHref && (
        <StorefrontLinkButton href={actionHref} className="mt-space-lg">
          {actionLabel}
        </StorefrontLinkButton>
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function StorefrontErrorState({
  title = "Something went wrong",
  description = "Please try again in a moment.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded border border-error/20 bg-error-container/30 px-space-lg py-space-3xl text-center",
        className
      )}
    >
      <h2 className="font-headline-md text-headline-md text-error">{title}</h2>
      <p className="mt-space-sm max-w-form font-body-md text-body-md text-on-surface-variant">
        {description}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-space-lg font-label-button text-label-button font-semibold uppercase tracking-wider text-primary underline-offset-4 hover:underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function StorefrontSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded bg-surface-container-high", className)}
      aria-hidden
    />
  );
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-space-lg sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col overflow-hidden rounded bg-surface-container-lowest">
          <StorefrontSkeleton className="aspect-[3/4] w-full" />
          <div className="space-y-2 p-space-md">
            <StorefrontSkeleton className="h-3 w-1/3" />
            <StorefrontSkeleton className="h-5 w-full" />
            <StorefrontSkeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
