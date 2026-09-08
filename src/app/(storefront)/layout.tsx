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
    <>
      <Header />
      <main className="min-h-[calc(100vh-320px)] w-full bg-surface pt-[92px] lg:pt-[104px]">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
      <Toaster />
    </>
  );
}
