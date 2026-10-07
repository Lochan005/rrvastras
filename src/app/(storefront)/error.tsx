"use client";

import { StorefrontContainer } from "@/components/storefront/ui/storefront-container";
import { StorefrontErrorState } from "@/components/storefront/ui/storefront-states";
import { StorefrontLinkButton } from "@/components/storefront/ui/storefront-button";

export default function StorefrontError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <StorefrontContainer className="py-space-4xl">
      <StorefrontErrorState
        title="We could not load this page"
        description="Something interrupted the request. Please try again or continue shopping."
        onRetry={reset}
      />
      <div className="mt-space-lg flex justify-center">
        <StorefrontLinkButton href="/shop" variant="outline">
          Browse shop
        </StorefrontLinkButton>
      </div>
    </StorefrontContainer>
  );
}
