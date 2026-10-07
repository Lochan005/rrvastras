import { cn } from "@/lib/utils";

type Width = "content" | "narrow" | "form" | "reading" | "full";

const widthClass: Record<Width, string> = {
  content: "max-w-content",
  narrow: "max-w-narrow",
  form: "max-w-form",
  reading: "max-w-reading",
  full: "max-w-none",
};

interface StorefrontContainerProps {
  children: React.ReactNode;
  className?: string;
  width?: Width;
  as?: "div" | "section" | "article";
}

export function StorefrontContainer({
  children,
  className,
  width = "content",
  as: Comp = "div",
}: StorefrontContainerProps) {
  return (
    <Comp
      className={cn(
        "mx-auto w-full px-gutter-mobile lg:px-gutter-desktop",
        widthClass[width],
        className
      )}
    >
      {children}
    </Comp>
  );
}
