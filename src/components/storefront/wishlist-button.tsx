"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
  initialInWishlist?: boolean;
  variant?: "pdp" | "card";
}

export function WishlistButton({
  productId,
  initialInWishlist = false,
  variant = "pdp",
}: WishlistButtonProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [inWishlist, setInWishlist] = useState(initialInWishlist);
  const [loading, setLoading] = useState(false);

  async function toggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      signIn("google");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/wishlist", {
        method: inWishlist ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) throw new Error("Failed to update wishlist");

      setInWishlist(!inWishlist);
      toast({
        title: inWishlist ? "Removed from wishlist" : "Added to wishlist",
      });
    } catch {
      toast({
        title: "Error",
        description: "Could not update wishlist",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  if (variant === "card") {
    return (
      <button
        type="button"
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        onClick={toggleWishlist}
        disabled={loading}
        className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-lowest/85 text-on-surface-variant shadow backdrop-blur transition-colors hover:text-primary"
      >
        <Heart
          className={cn(
            "h-[18px] w-[18px]",
            inWishlist ? "fill-primary text-primary" : ""
          )}
        />
      </button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-12 w-12 shrink-0"
      onClick={toggleWishlist}
      disabled={loading}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-colors",
          inWishlist ? "fill-primary text-primary" : "text-foreground"
        )}
      />
    </Button>
  );
}
