import type { Metadata } from "next";
import { getStoreSettings } from "@/lib/store";
import { getWhatsAppUrl } from "@/lib/utils";
import { StorefrontContainer } from "@/components/storefront/ui/storefront-container";
import { PageHeader } from "@/components/storefront/ui/page-header";
import { StorefrontLinkButton } from "@/components/storefront/ui/storefront-button";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with RR Vastras for orders, sizing, and saree enquiries.",
};

export default async function ContactPage() {
  const settings = await getStoreSettings();
  const whatsappUrl = getWhatsAppUrl(
    settings.whatsappNumber,
    "Hi RR Vastras, I'd like to get in touch."
  );

  return (
    <StorefrontContainer width="reading" className="py-space-3xl lg:py-space-4xl">
      <PageHeader
        title="Contact us"
        align="center"
        description="Have a question about an order, a saree, or shipping? We'd love to hear from you."
      />

      <div className="grid gap-space-lg md:grid-cols-2">
        <div className="rounded border border-outline-variant/40 bg-surface-container-lowest p-space-lg shadow-sm">
          <h2 className="font-headline-sm text-headline-sm text-primary">WhatsApp</h2>
          <p className="mt-space-sm font-body-md text-body-md leading-relaxed text-on-surface-variant">
            The fastest way to reach us. Tap below to start a chat with our support team.
          </p>
          <StorefrontLinkButton
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-space-lg w-full sm:w-auto"
          >
            Chat on WhatsApp
          </StorefrontLinkButton>
        </div>

        <div className="rounded border border-outline-variant/40 bg-surface-container-lowest p-space-lg shadow-sm">
          <h2 className="font-headline-sm text-headline-sm text-primary">Order support</h2>
          <p className="mt-space-sm font-body-md text-body-md leading-relaxed text-on-surface-variant">
            For order status and delivery questions, sign in to your account or message us on WhatsApp.
          </p>
          <StorefrontLinkButton href="/account" variant="outline" className="mt-space-lg w-full sm:w-auto">
            Go to account
          </StorefrontLinkButton>
        </div>

        <div className="rounded border border-outline-variant/40 bg-surface-container p-space-lg text-center md:col-span-2">
          <h2 className="font-headline-sm text-headline-sm text-primary">Delivery across India</h2>
          <p className="mx-auto mt-space-sm max-w-form font-body-md text-body-md text-on-surface-variant">
            We deliver pan-India after your order is confirmed. Delivery is typically within 5–7 days.
            Shipping is free on every order and is included in your checkout total.
          </p>
        </div>
      </div>
    </StorefrontContainer>
  );
}
