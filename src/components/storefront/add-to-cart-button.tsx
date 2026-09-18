"use client";

import { useCart } from "@/components/providers/cart-provider";
import { useToast } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
  product: {
    id: string;
    slug: string;
    name: string;
    priceInPaise: number;
    stock: number;
    imageUrl: string;
    imageAlt: string;
  };
  disabled?: boolean;
}

export function AddToCartButton({ product, disabled }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  function handleAdd() {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        priceInPaise: product.priceInPaise,
        imageUrl: product.imageUrl,
        imageAlt: product.imageAlt,
        stock: product.stock,
      },
      1
    );
    toast({
      title: "Added to cart",
      description: product.name,
    });
  }

  return (
    <Button
      onClick={handleAdd}
      disabled={disabled}
      size="lg"
      className="w-full uppercase tracking-wider font-semibold"
    >
      {disabled ? "Out of Stock" : "Add to Cart"}
    </Button>
  );
}
