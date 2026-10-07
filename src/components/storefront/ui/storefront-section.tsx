import { cn } from "@/lib/utils";
import { StorefrontContainer } from "./storefront-container";

interface StorefrontSectionProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  background?: "surface" | "surface-low" | "surface-container" | "white" | "none";
  padding?: "none" | "md" | "lg" | "xl";
  width?: "content" | "narrow" | "form" | "reading" | "full";
  as?: "section" | "div";
}

const bgClass = {
  surface: "bg-surface",
  "surface-low": "bg-surface-container-low",
  "surface-container": "bg-surface-container",
  white: "bg-surface-container-lowest",
  none: "",
};

const padClass = {
  none: "",
  md: "py-space-2xl",
  lg: "py-space-3xl",
  xl: "py-space-4xl",
};

export function StorefrontSection({
  children,
  className,
  containerClassName,
  background = "surface",
  padding = "lg",
  width = "content",
  as: Comp = "section",
}: StorefrontSectionProps) {
  return (
    <Comp className={cn("w-full", bgClass[background], padClass[padding], className)}>
      <StorefrontContainer width={width} className={containerClassName}>
        {children}
      </StorefrontContainer>
    </Comp>
  );
}
