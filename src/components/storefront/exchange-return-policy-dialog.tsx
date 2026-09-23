"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  EXCHANGE_RETURN_POLICY_INTRO,
  EXCHANGE_RETURN_POLICY_SECTIONS,
  EXCHANGE_RETURN_POLICY_TITLE,
} from "@/lib/exchange-return-policy";

interface ExchangeReturnPolicyDialogProps {
  triggerClassName?: string;
  triggerLabel?: string;
}

export function ExchangeReturnPolicyDialog({
  triggerClassName,
  triggerLabel = "Exchange & Return Policy",
}: ExchangeReturnPolicyDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={cn(
            "underline underline-offset-4 transition-colors hover:text-primary",
            triggerClassName
          )}
        >
          {triggerLabel}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-on-surface/50 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 flex max-h-[min(80vh,640px)] w-[min(100%-2rem,520px)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg border border-border bg-surface-container-lowest shadow-lg">
          <div className="border-b border-border px-5 py-4">
            <Dialog.Title className="font-serif text-xl font-semibold text-foreground">
              {EXCHANGE_RETURN_POLICY_TITLE}
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm leading-relaxed text-muted">
              {EXCHANGE_RETURN_POLICY_INTRO}
            </Dialog.Description>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
            {EXCHANGE_RETURN_POLICY_SECTIONS.map((section) => (
              <section key={section.heading}>
                <h3 className="text-sm font-semibold tracking-wide text-foreground uppercase">
                  {section.heading}
                </h3>
                {"intro" in section && section.intro ? (
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {section.intro}
                  </p>
                ) : null}
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-on-surface">
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {"note" in section && section.note ? (
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {section.note}
                  </p>
                ) : null}
              </section>
            ))}
          </div>

          <div className="border-t border-border px-5 py-4">
            <Dialog.Close asChild>
              <Button className="w-full uppercase tracking-wider" size="lg">
                Agree
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
