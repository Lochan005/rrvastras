"use client";

import { useState } from "react";
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
  const [quantity, setQuantity] = useState(1);

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
      quantity
    );
    toast({
      title: "Added to cart",
      description: `${product.name} × ${quantity}`,
    });
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full">
      <div className="flex items-center justify-between rounded-sm border border-border bg-transparent h-12 w-full sm:w-32">
        <button
          className="px-4 h-full text-lg hover:text-primary transition-colors disabled:opacity-50"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          disabled={disabled}
        >
          −
        </button>
        <span className="px-2 text-base font-medium">{quantity}</span>
        <button
          className="px-4 h-full text-lg hover:text-primary transition-colors disabled:opacity-50"
          onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
          disabled={disabled}
        >
          +
        </button>
      </div>
      <Button 
        onClick={handleAdd} 
        disabled={disabled} 
        size="lg" 
        className="flex-1 uppercase tracking-wider font-semibold"
      >
        {disabled ? "Out of Stock" : "Add to Cart"}
      </Button>
    </div>
  );
}
