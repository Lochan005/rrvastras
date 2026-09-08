"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Do your sarees include a blouse piece?",
    a: "Yes, absolutely. Every saree curated at RR Vastras comes with an unstitched matching blouse piece (approx. 0.8 to 1 meter in length) attached to the end of the saree drape. You can easily tailor it to your personalized measurements and styling preferences.",
  },
  {
    q: "What are the shipping charges?",
    a: "We offer complimentary standard insured shipping across India on all orders above ₹7,500. For orders below this amount, a modest flat shipping rate of ₹150 applies at checkout.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major Debit/Credit cards, Net Banking, and UPI payments (Google Pay, PhonePe, Paytm) securely processed through our encrypted Cashfree gateway. To maintain hygiene, authenticity, and prevent transit handling delays, we do not offer Cash on Delivery (COD).",
  },
  {
    q: "How long does delivery take?",
    a: "Each saree undergoes our rigorous manual hand-inspection and iron press check. Orders are dispatched from our boutique warehouse within 2–3 business days. Final transit with our courier partners takes between 5–7 business days anywhere in India.",
  },
  {
    q: "Can I return or exchange a saree?",
    a: "We stand completely behind the authenticity of our weaves. If your saree is damaged or incorrect upon arrival, simply contact our concierge team via WhatsApp or email within 48 hours of delivery with unboxing photos. The saree must remain unused, unwashed, and folded in its original packaging with tags intact.",
  },
];

export function HomeFaq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="flex flex-col gap-space-sm">
      {faqs.map((faq, i) => {
        const open = openIndex === i;
        return (
          <div
            key={faq.q}
            className="overflow-hidden rounded bg-surface-container-lowest shadow-sm transition-all duration-200"
          >
            <button
              type="button"
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-space-md px-space-lg py-space-md text-left transition-colors hover:bg-surface-container-low"
              onClick={() => setOpenIndex(open ? -1 : i)}
            >
              <span className="font-headline-sm text-headline-sm font-medium text-primary">
                {faq.q}
              </span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-secondary transition-transform duration-300",
                  open && "rotate-180"
                )}
              />
            </button>
            {open && (
              <div className="px-space-lg pb-space-md font-body-md text-body-md leading-relaxed text-on-surface-variant">
                {faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
