import { normalizeOrigin } from "@/lib/utils";

/**
 * Auth.js builds Google's redirect_uri from AUTH_URL. Vercel often sets that
 * to *.vercel.app, while shoppers sign in on the custom domain — so the PKCE
 * cookie is stored on www.rrvastras.in and the callback lands on vercel.app.
 */
function originIfCustom(value?: string): string | undefined {
  const origin = normalizeOrigin(value);
  if (!origin) return undefined;
  if (new URL(origin).hostname.endsWith(".vercel.app")) return undefined;
  return origin;
}

export function applyCanonicalAuthUrl() {
  const origin =
    originIfCustom(process.env.NEXT_PUBLIC_SITE_URL) ??
    originIfCustom(process.env.AUTH_URL) ??
    originIfCustom(process.env.VERCEL_PROJECT_PRODUCTION_URL);

  if (!origin) return;
  process.env.AUTH_URL = origin;
  process.env.NEXTAUTH_URL = origin;
}

applyCanonicalAuthUrl();
