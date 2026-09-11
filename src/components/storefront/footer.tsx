import Link from "next/link";
import { Camera, Share2 } from "lucide-react";
import { BrandMark } from "./brand-mark";
import { getStoreSettings } from "@/lib/store";
import { getWhatsAppUrl } from "@/lib/utils";

export async function Footer() {
  const settings = await getStoreSettings();
  const whatsappUrl = getWhatsAppUrl(
    settings.whatsappNumber,
    "Hi RR Vastras, I have a question."
  );

  return (
    <footer className="w-full border-t border-tertiary-fixed-dim/40 bg-primary text-surface-container-lowest">
      <div className="mx-auto max-w-[1360px] px-gutter-mobile py-space-3xl lg:px-gutter-desktop">
        <div className="grid grid-cols-1 gap-space-2xl md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-space-md">
            <BrandMark compact />
            <p className="font-body-sm text-body-sm leading-relaxed text-surface-variant/80">
              Curated women&apos;s sarees in pure silk, fine cotton, and heritage
              handloom weaves across India.
            </p>
            <div className="flex items-center gap-space-sm pt-space-xs">
              <a
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded border border-outline-variant/30 text-tertiary-fixed transition-colors hover:border-tertiary-fixed"
                href="#"
              >
                <Camera className="h-[18px] w-[18px]" />
              </a>
              <a
                aria-label="Share"
                className="flex h-8 w-8 items-center justify-center rounded border border-outline-variant/30 text-tertiary-fixed transition-colors hover:border-tertiary-fixed"
                href="#"
              >
                <Share2 className="h-[18px] w-[18px]" />
              </a>
            </div>
          </div>

          <div className="space-y-space-md">
            <h3 className="font-headline-sm text-headline-sm text-tertiary-fixed">Shop</h3>
            <ul className="space-y-space-xs font-body-sm text-body-sm text-surface-variant/80">
              <li>
                <Link href="/shop" className="transition-colors hover:text-tertiary-fixed">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/shop?fabric=silk" className="transition-colors hover:text-tertiary-fixed">
                  Silk Sarees
                </Link>
              </li>
              <li>
                <Link href="/shop?fabric=cotton" className="transition-colors hover:text-tertiary-fixed">
                  Cotton Sarees
                </Link>
              </li>
              <li>
                <Link href="/shop?fabric=handloom" className="transition-colors hover:text-tertiary-fixed">
                  Handloom Collection
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-space-md">
            <h3 className="font-headline-sm text-headline-sm text-tertiary-fixed">Support</h3>
            <ul className="space-y-space-xs font-body-sm text-body-sm text-surface-variant/80">
              <li>
                <Link href="/account" className="transition-colors hover:text-tertiary-fixed">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="transition-colors hover:text-tertiary-fixed">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-tertiary-fixed">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-tertiary-fixed">
                  Returns &amp; Exchanges
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-space-md">
            <h3 className="font-headline-sm text-headline-sm text-tertiary-fixed">Contact</h3>
            <ul className="space-y-space-xs font-body-sm text-body-sm text-surface-variant/80">
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-tertiary-fixed"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="tel:+919902349888"
                  className="transition-colors hover:text-tertiary-fixed"
                >
                  +91 9902349888
                </a>
              </li>
              <li>Mon–Sat, 9:00 AM–6:00 PM IST</li>
            </ul>
          </div>
        </div>

        <div className="mt-space-2xl flex flex-col items-center justify-between gap-space-sm border-t border-outline-variant/20 pt-space-lg font-body-sm text-body-sm text-surface-variant/60 md:flex-row">
          <p>© {new Date().getFullYear()} RR Vastras. All rights reserved.</p>
          <div className="flex items-center gap-space-md">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Service</span>
            <span>·</span>
            <span>Cards &amp; UPI via Cashfree</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
