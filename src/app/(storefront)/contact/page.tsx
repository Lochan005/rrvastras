import type { Metadata } from "next";
import Link from "next/link";
import { getStoreSettings } from "@/lib/store";
import { getWhatsAppUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Contact Us</h1>
        <div className="h-1 w-20 bg-gold mx-auto" />
        <p className="mt-6 text-lg text-muted max-w-2xl mx-auto">
          Have a question about an order, a saree, or shipping? We&apos;d love to
          hear from you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="rounded-sm border border-border bg-background p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-xl font-serif font-semibold">WhatsApp</h2>
          </div>
          <p className="text-muted mb-6 leading-relaxed">
            The fastest way to reach us. Tap below to start a chat with our support team.
          </p>
          <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
            <Button className="w-full">Chat on WhatsApp</Button>
          </Link>
        </div>

        <div className="rounded-sm border border-border bg-background p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-serif font-semibold">Order Support</h2>
          </div>
          <p className="text-muted mb-6 leading-relaxed">
            For order tracking and delivery updates, sign in to your account to
            view order history.
          </p>
          <Link href="/account" className="block">
            <Button variant="outline" className="w-full">Go to Account</Button>
          </Link>
        </div>

        <div className="md:col-span-2 rounded-sm border border-border bg-accent/30 p-8 text-center">
          <h2 className="text-xl font-serif font-semibold mb-4">Shipping Information</h2>
          <p className="text-muted max-w-2xl mx-auto">
            We ship across India. A flat ₹150 delivery charge applies to standard orders. 
            Enjoy <span className="font-semibold text-foreground">free shipping</span> on all orders above ₹7,500.
          </p>
        </div>
      </div>
    </div>
  );
}
