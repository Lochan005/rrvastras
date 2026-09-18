"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  ChevronRight,
  Heart,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { usePathname } from "next/navigation";
import { AnnouncementBar } from "./announcement-bar";
import { BrandMark } from "./brand-mark";

const navLinks = [
  { href: "/", label: "Home", match: "exact" as const },
  { href: "/shop", label: "Shop", match: "prefix" as const },
  { href: "/shop?fabric=silk", label: "Fabrics", match: "none" as const },
  { href: "/shop", label: "Occasions", match: "none" as const },
  { href: "/about", label: "About", match: "prefix" as const },
];

export function Header() {
  const { data: session } = useSession();
  const { count } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const pathname = usePathname();
  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setAccountOpen(false);
  }, [pathname]);

  return (
    <div className="fixed top-0 left-0 z-50 w-full">
      <AnnouncementBar />
      <header className="w-full border-b border-outline-variant/40 bg-surface-container-lowest/95 backdrop-blur-md">
        <div className="mx-auto flex h-[60px] max-w-[1360px] items-center justify-between gap-space-lg px-gutter-mobile lg:h-[72px] lg:px-gutter-desktop">
          <div className="flex flex-1 items-center lg:hidden">
            <button
              type="button"
              className="p-space-2xs text-on-surface-variant hover:text-primary"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          <div className="flex flex-1 justify-center lg:flex-none lg:justify-start">
            <BrandMark />
          </div>

          <nav className="hidden items-center gap-space-xl lg:flex">
            {navLinks.map((link) => {
              const isActive =
                link.match === "exact"
                  ? pathname === "/"
                  : link.match === "prefix"
                    ? pathname === link.href || pathname.startsWith(`${link.href}/`)
                    : false;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={
                    isActive
                      ? "border-b-2 border-primary-container py-space-xs font-label-button text-label-button font-semibold uppercase text-primary-container"
                      : "py-space-xs font-label-button text-label-button uppercase text-on-surface-variant transition-colors hover:text-primary"
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-1 items-center justify-end gap-space-md">
            <Link
              href="/shop"
              aria-label="Search"
              className="hidden p-space-2xs text-on-surface-variant transition-colors hover:text-primary lg:inline-flex"
            >
              <Search className="h-5 w-5" />
            </Link>
            <Link
              href="/account/wishlist"
              aria-label="Wishlist"
              className="relative hidden p-space-2xs text-on-surface-variant transition-colors hover:text-primary lg:inline-flex"
            >
              <Heart className="h-5 w-5" />
            </Link>
            {session ? (
              <div className="relative hidden lg:block">
                <button
                  type="button"
                  aria-label="Account menu"
                  aria-expanded={accountOpen}
                  className="inline-flex p-space-2xs text-on-surface-variant transition-colors hover:text-primary"
                  onClick={() => setAccountOpen((open) => !open)}
                >
                  {session.user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session.user.image}
                      alt=""
                      className="h-8 w-8 rounded-full border border-outline-variant/80 object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </button>
                {accountOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-lg border border-outline-variant bg-surface-container-lowest py-1 shadow-lg">
                    <Link
                      href="/account"
                      className="block px-4 py-2.5 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low"
                      onClick={() => setAccountOpen(false)}
                    >
                      My Account
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2.5 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low"
                        onClick={() => setAccountOpen(false)}
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left font-body-sm text-body-sm text-error hover:bg-error-container"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                aria-label="Sign in"
                className="hidden p-space-2xs text-on-surface-variant transition-colors hover:text-primary lg:inline-flex"
                onClick={() => signIn("google")}
              >
                <User className="h-5 w-5" />
              </button>
            )}
            <Link href="/cart" aria-label="Cart" className="relative p-space-2xs text-on-surface-variant transition-colors hover:text-primary">
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-container font-label-badge text-[10px] font-bold text-on-primary">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            className="fixed inset-0 bg-primary/50 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex h-full w-4/5 max-w-sm flex-col bg-surface-container-lowest shadow-xl">
            <div className="flex items-center justify-between border-b border-outline-variant px-4 py-4">
              <span className="font-headline-sm text-headline-sm font-bold uppercase tracking-[0.18em] text-primary">
                RR Vastras
              </span>
              <button
                type="button"
                className="p-space-2xs text-on-surface"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between px-6 py-3 font-label-button text-label-button uppercase text-on-surface hover:bg-surface-container-low"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                  <ChevronRight className="h-4 w-4 text-outline" />
                </Link>
              ))}
            </nav>
            <div className="space-y-2 border-t border-outline-variant bg-surface-container-low p-4">
              <Link
                href="/account/wishlist"
                className="flex items-center gap-3 px-2 py-2 text-sm text-on-surface"
                onClick={() => setMobileOpen(false)}
              >
                <Heart className="h-5 w-5 text-outline" />
                Wishlist
              </Link>
              {session ? (
                <>
                  <Link
                    href="/account"
                    className="flex items-center gap-3 px-2 py-2 text-sm text-on-surface"
                    onClick={() => setMobileOpen(false)}
                  >
                    <User className="h-5 w-5 text-outline" />
                    Account
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 px-2 py-2 text-sm text-on-surface"
                      onClick={() => setMobileOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-3 px-2 py-2 text-left text-sm text-error"
                  >
                    <LogOut className="h-5 w-5" />
                    Log out
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    signIn("google");
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-3 px-2 py-2 text-left text-sm text-on-surface"
                >
                  <User className="h-5 w-5 text-outline" />
                  Sign in / Register
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
