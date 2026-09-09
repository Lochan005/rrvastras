import type { Metadata } from "next";
import { EB_Garamond, Manrope, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "@/components/providers/auth-provider";
import { CartProvider } from "@/components/providers/cart-provider";
import { ToastProvider } from "@/components/ui/toaster";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { getSiteUrl } from "@/lib/utils";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const garamond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "RR Vastras | Women's Sarees",
    template: "%s | RR Vastras",
  },
  description:
    "Shop elegant women's sarees at RR Vastras. Premium silk, cotton, and handloom sarees with nationwide delivery across India.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "RR Vastras",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${garamond.variable} ${plusJakarta.variable}`}
    >
      <body className="min-h-screen bg-surface font-body-md text-body-md text-on-surface antialiased">
        <AuthProvider>
          <ToastProvider>
            <CartProvider>{children}</CartProvider>
          </ToastProvider>
        </AuthProvider>
        <GoogleAnalytics />
        <Analytics />
      </body>
    </html>
  );
}
