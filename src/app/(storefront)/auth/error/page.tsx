import Link from "next/link";

const ERROR_COPY: Record<string, { title: string; body: string }> = {
  Configuration: {
    title: "Sign-in is misconfigured",
    body: "Google login is not fully set up for this site. Please try again in a few minutes, or reach us on WhatsApp if it continues.",
  },
  AccessDenied: {
    title: "Access was denied",
    body: "This Google account could not be signed in. Try another account, or contact us if you believe this is a mistake.",
  },
  Verification: {
    title: "Sign-in link expired",
    body: "That sign-in attempt is no longer valid. Please start again from the sign-in page.",
  },
  Callback: {
    title: "Could not finish signing in",
    body: "Google returned to a different site address than the one you started on. Please try again from rrvastras.in.",
  },
  Default: {
    title: "Could not sign in",
    body: "Something went wrong while signing in with Google. Please try again.",
  },
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const copy = ERROR_COPY[error ?? ""] ?? ERROR_COPY.Default;

  return (
    <div className="mx-auto w-full max-w-[520px] px-gutter-mobile pt-space-2xl pb-space-4xl lg:px-gutter-desktop">
      <span className="font-label-eyebrow text-label-eyebrow font-bold tracking-[0.25em] text-primary uppercase">
        Sign in
      </span>
      <h1 className="font-headline-xl text-headline-xl-mobile mt-space-2xs tracking-wide text-primary md:text-headline-xl">
        {copy.title}
      </h1>
      <p className="mt-space-sm font-body-sm text-body-sm text-on-surface-variant">
        {copy.body}
      </p>
      <Link
        href="/auth/signin"
        className="mt-space-2xl inline-flex items-center justify-center rounded bg-primary px-space-xl py-space-md font-label-button text-label-button tracking-wider text-on-primary uppercase"
      >
        Try again
      </Link>
    </div>
  );
}
