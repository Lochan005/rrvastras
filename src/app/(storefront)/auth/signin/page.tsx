"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/account";

  return (
    <div className="mx-auto w-full max-w-[520px] px-gutter-mobile pt-space-2xl pb-space-4xl lg:px-gutter-desktop">
      <span className="font-label-eyebrow text-label-eyebrow font-bold tracking-[0.25em] text-primary uppercase">
        Patron Access
      </span>
      <h1 className="font-headline-xl text-headline-xl-mobile mt-space-2xs tracking-wide text-primary md:text-headline-xl">
        Sign in to RR Vastras
      </h1>
      <p className="mt-space-sm font-body-sm text-body-sm text-on-surface-variant">
        Sign in with Google to view orders, wishlist, and saved addresses.
      </p>

      <div className="mt-space-2xl rounded-xl bg-surface-container-lowest p-space-xl shadow-sm">
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl })}
          className="inline-flex w-full items-center justify-center rounded bg-primary px-space-xl py-space-md font-label-button text-label-button tracking-wider text-on-primary uppercase"
        >
          Continue with Google
        </button>
        <p className="mt-space-md text-center font-body-sm text-body-sm text-on-surface-variant">
          Returning to shop?{" "}
          <Link href="/shop" className="font-semibold text-primary underline">
            Browse the collection
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center font-body-sm text-on-surface-variant">
          Loading...
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
