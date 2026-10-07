export const dynamic = "force-dynamic";

import { Header } from "@/components/storefront/header";
import { Footer } from "@/components/storefront/footer";
import { WhatsAppButton } from "@/components/storefront/whatsapp-button";
import { Toaster } from "@/components/ui/toaster";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="w-full flex-1 bg-surface">{children}</main>
      <Footer />
      <WhatsAppButton />
      <Toaster />
    </div>
  );
}
