import * as React from "react";
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const storefrontButtonVariants = cva(
  "inline-flex items-center justify-center gap-space-xs rounded font-label-button text-label-button font-bold tracking-wider uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-surface-container-lowest shadow-md hover:bg-primary-container",
        gold:
          "bg-cta-gold text-primary shadow-lg hover:-translate-y-0.5 hover:bg-[var(--color-cta-gold-hover)]",
        ghost:
          "bg-transparent text-primary hover:text-primary-container",
        outline:
          "border border-outline-variant bg-transparent text-on-surface hover:border-primary hover:text-primary",
      },
      size: {
        default: "px-space-xl py-space-md",
        sm: "px-space-lg py-space-sm text-[12px]",
        lg: "px-space-2xl py-space-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface StorefrontButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof storefrontButtonVariants> {
  asChild?: boolean;
}

export const StorefrontButton = React.forwardRef<
  HTMLButtonElement,
  StorefrontButtonProps
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(storefrontButtonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
StorefrontButton.displayName = "StorefrontButton";

export { storefrontButtonVariants };

interface StorefrontLinkButtonProps
  extends React.ComponentPropsWithoutRef<typeof Link>,
    VariantProps<typeof storefrontButtonVariants> {}

export function StorefrontLinkButton({
  className,
  variant,
  size,
  ...props
}: StorefrontLinkButtonProps) {
  return (
    <Link
      className={cn(storefrontButtonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
