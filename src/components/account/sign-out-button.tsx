"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

export function SignOutButton({
  className,
  label = "Log out",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded border border-outline-variant bg-surface-container-lowest px-4 py-2.5 font-label-button text-label-button text-primary transition-colors hover:border-error hover:bg-error-container hover:text-error",
        className
      )}
    >
      <LogOut className="h-[18px] w-[18px]" />
      <span>{label}</span>
    </button>
  );
}
