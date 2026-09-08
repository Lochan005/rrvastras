import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { getStoreSettings } from "@/lib/store";
import { getWhatsAppUrl } from "@/lib/utils";

export async function WhatsAppButton() {
  const settings = await getStoreSettings();
  const url = getWhatsAppUrl(
    settings.whatsappNumber,
    "Hi RR Vastras, I have a question about your sarees."
  );

  return (
    <aside className="fixed right-6 bottom-6 z-40">
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group flex items-center gap-space-xs rounded-full bg-[#25D366] px-space-md py-space-sm text-white shadow-[0_4px_20px_rgba(37,211,102,0.35)] transition-all hover:-translate-y-0.5 hover:bg-[#1EBE5D]"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="pr-1 font-label-button text-label-button font-medium tracking-wide">
          Chat on WhatsApp
        </span>
      </Link>
    </aside>
  );
}
