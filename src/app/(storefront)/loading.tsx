import { StorefrontContainer } from "@/components/storefront/ui/storefront-container";
import { ProductGridSkeleton, StorefrontSkeleton } from "@/components/storefront/ui/storefront-states";

export default function StorefrontLoading() {
  return (
    <StorefrontContainer className="py-space-2xl">
      <StorefrontSkeleton className="mb-space-lg h-10 w-64 max-w-full" />
      <StorefrontSkeleton className="mb-space-2xl h-5 w-96 max-w-full" />
      <ProductGridSkeleton count={8} />
    </StorefrontContainer>
  );
}
