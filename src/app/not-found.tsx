import { StorefrontContainer } from "@/components/storefront/ui/storefront-container";
import { StorefrontEmptyState } from "@/components/storefront/ui/storefront-states";

export default function NotFound() {
  return (
    <StorefrontContainer className="py-space-4xl">
      <StorefrontEmptyState
        title="Page not found"
        description="The page you're looking for doesn't exist or may have moved."
        actionLabel="Go home"
        actionHref="/"
      />
    </StorefrontContainer>
  );
}
