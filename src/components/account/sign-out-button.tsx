"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="inline-flex w-full items-center justify-center gap-2 rounded bg-transparent py-2 font-label-button text-label-button text-outline transition-colors hover:text-error"
    >
      <LogOut className="h-[18px] w-[18px]" />
      <span>Sign Out of Account</span>
    </button>
  );
}
