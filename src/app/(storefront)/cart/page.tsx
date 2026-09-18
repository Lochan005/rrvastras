"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/providers/cart-provider";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, removeItem, count } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-3xl font-serif font-bold text-foreground">Your Shopping Bag</h1>
        <p className="mt-4 text-muted">Your bag is currently empty.</p>
        <Link href="/shop" className="mt-8 inline-block">
          <Button size="lg" className="uppercase tracking-wider">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.priceInPaise * item.quantity,
    0
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-serif font-bold text-foreground mb-8">Your Bag ({count} items)</h1>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-6 border-b border-border pb-6"
            >
              <Link
                href={`/shop/${item.slug}`}
                className="relative h-32 w-24 shrink-0 overflow-hidden rounded-sm bg-accent"
              >
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted">
                    No img
                  </div>
                )}
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <Link
                      href={`/shop/${item.slug}`}
                      className="font-serif font-semibold text-lg hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-muted mt-1">
                      {formatINR(item.priceInPaise)} each
                    </p>
                  </div>
                  <p className="font-semibold text-foreground">
                    {formatINR(item.priceInPaise * item.quantity)}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <button
                    className="text-sm text-muted hover:text-destructive transition-colors underline underline-offset-4"
                    onClick={() => removeItem(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-accent/30 p-6 rounded-sm border border-border sticky top-24">
            <h2 className="text-lg font-serif font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm text-muted mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-foreground">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            
            <div className="border-t border-border pt-4 mb-6">
              <div className="flex justify-between text-lg font-semibold text-foreground">
                <span>Total</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <p className="text-xs text-muted mt-1">Inclusive of all taxes</p>
            </div>
            
            <Link href="/checkout" className="block w-full">
              <Button className="w-full uppercase tracking-wider font-semibold" size="lg">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
