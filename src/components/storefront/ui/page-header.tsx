import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
  align?: "start" | "center";
}

export function PageHeader({
  title,
  description,
  eyebrow,
  breadcrumbs,
  className,
  align = "start",
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "mb-space-2xl",
        align === "center" && "mx-auto max-w-2xl text-center",
        className
      )}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-space-sm">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-body-sm text-body-sm text-on-surface-variant">
            {breadcrumbs.map((item, index) => (
              <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                {index > 0 && <span aria-hidden className="text-outline">/</span>}
                {item.href ? (
                  <Link href={item.href} className="hover:text-primary">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-on-surface">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      {eyebrow && (
        <span className="mb-space-2xs block font-label-eyebrow text-label-eyebrow font-bold tracking-[0.2em] text-secondary uppercase">
          {eyebrow}
        </span>
      )}
      <h1 className="font-headline-xl text-headline-xl-mobile font-medium tracking-wide text-primary md:text-headline-xl">
        {title}
      </h1>
      {description && (
        <p className="mt-space-xs max-w-reading font-body-md text-body-md text-on-surface-variant">
          {description}
        </p>
      )}
    </header>
  );
}
