"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Product, ProductImage } from "@prisma/client";
import { upload } from "@vercel/blob/client";
import { Trash2 } from "lucide-react";
import { slugify } from "@/lib/utils";
import {
  getDiscountPercent,
  paiseToRupeesInput,
  rupeesToPaise,
} from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toaster";

type ProductWithImages = Product & { images: ProductImage[] };
type ProductMedia = {
  url: string;
  alt: string;
  mediaType: "image" | "video";
  sortOrder: number;
};

interface ProductFormProps {
  product?: ProductWithImages;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    priceInPaise: paiseToRupeesInput(product?.priceInPaise),
    compareAtPriceInPaise: paiseToRupeesInput(product?.compareAtPriceInPaise),
    productCode: product?.productCode ?? "",
    description: product?.description ?? "",
    stock: product?.stock?.toString() ?? "1",
    blouseIncluded: product?.blouseIncluded ?? true,
    isPublished: product?.isPublished ?? false,
  });
  const [images, setImages] = useState<ProductMedia[]>(
    product?.images.map((img, i) => ({
      url: img.url,
      alt: img.alt,
      mediaType: img.mediaType === "video" ? "video" : "image",
      sortOrder: i,
    })) ?? []
  );

  function handleNameChange(name: string) {
    setForm((prev) => ({
      ...prev,
      name,
      slug: product ? prev.slug : slugify(name),
    }));
  }

  async function handleMediaUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const mediaType = file.type.startsWith("video/") ? "video" : "image";
    const alt = `${form.name || "Saree"} ${mediaType}`;

    setUploading(true);
    try {
      let url: string;
      try {
        const blob = await upload(`products/${Date.now()}-${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/admin/upload",
        });
        url = blob.url;
      } catch {
        // Keep local development usable when Vercel Blob is not configured.
        const formData = new FormData();
        formData.append("file", file);
        formData.append("alt", alt);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        url = data.url;
      }

      setImages((prev) => [
        ...prev,
        { url, alt, mediaType, sortOrder: prev.length },
      ]);
      toast({ title: `${mediaType === "video" ? "Video" : "Image"} uploaded` });
      e.target.value = "";
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : undefined,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const priceInPaise = rupeesToPaise(form.priceInPaise);
      if (priceInPaise == null) {
        throw new Error("Enter a valid current price");
      }

      const compareAtPriceInPaise = rupeesToPaise(form.compareAtPriceInPaise);
      if (
        form.compareAtPriceInPaise.trim() &&
        (compareAtPriceInPaise == null || compareAtPriceInPaise <= priceInPaise)
      ) {
        throw new Error("Original price must be higher than the current price");
      }

      const payload = {
        ...form,
        priceInPaise,
        compareAtPriceInPaise,
        stock: parseInt(form.stock, 10),
        images,
      };

      const url = product
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products";
      const method = product ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      toast({ title: product ? "Product updated" : "Product created" });
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Save failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!product || !confirm("Delete this product?")) return;

    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast({ title: "Product deleted" });
      router.push("/admin/products");
    }
  }

  const currentPricePaise = rupeesToPaise(form.priceInPaise);
  const originalPricePaise = rupeesToPaise(form.compareAtPriceInPaise);
  const discountPercent =
    currentPricePaise != null
      ? getDiscountPercent(originalPricePaise, currentPricePaise)
      : null;

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-xl space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          required
          value={form.name}
          onChange={(e) => handleNameChange(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          required
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="price">Current price (₹)</Label>
          <Input
            id="price"
            type="number"
            required
            min="0"
            step="1"
            value={form.priceInPaise}
            onChange={(e) => setForm({ ...form, priceInPaise: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="compareAtPrice">Original price (₹)</Label>
          <Input
            id="compareAtPrice"
            type="number"
            min="0"
            step="1"
            placeholder="Optional"
            value={form.compareAtPriceInPaise}
            onChange={(e) =>
              setForm({ ...form, compareAtPriceInPaise: e.target.value })
            }
          />
        </div>
      </div>
      {discountPercent != null ? (
        <p className="text-sm text-muted">
          Discount{" "}
          <span className="font-semibold text-foreground">{discountPercent}%</span>
        </p>
      ) : null}
      <div>
        <Label htmlFor="productCode">Product Code</Label>
        <Input
          id="productCode"
          required
          value={form.productCode}
          onChange={(e) => setForm({ ...form, productCode: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="stock">Stock</Label>
        <Input
          id="stock"
          type="number"
          required
          min="0"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />
        <p className="mt-1 text-xs text-muted">
          Default is 1. Shoppers can buy one of each saree. Remaining quantity is never shown on the store.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.blouseIncluded}
            onChange={(e) =>
              setForm({ ...form, blouseIncluded: e.target.checked })
            }
          />
          Blouse piece included
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) =>
              setForm({ ...form, isPublished: e.target.checked })
            }
          />
          Published
        </label>
      </div>

      <div>
        <Label>Product images and videos</Label>
        <p className="mt-1 text-xs text-muted">
          Upload JPG, PNG, WebP, GIF, MP4, WebM, or MOV files up to 50 MB.
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          {images.map((media, i) => (
            <div
              key={`${media.url}-${i}`}
              className="group relative h-24 w-20 overflow-hidden rounded-md bg-accent"
            >
              {media.mediaType === "video" ? (
                <video
                  src={media.url}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                />
              ) : (
                <Image
                  src={media.url}
                  alt={media.alt}
                  fill
                  className="object-cover"
                />
              )}
              <button
                type="button"
                aria-label={`Remove ${media.mediaType}`}
                className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                onClick={() =>
                  setImages((items) =>
                    items
                      .filter((_, index) => index !== i)
                      .map((item, index) => ({ ...item, sortOrder: index }))
                  )
                }
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <Input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
          className="mt-2"
          onChange={handleMediaUpload}
          disabled={uploading}
        />
        {uploading && <p className="mt-1 text-xs text-muted">Uploading…</p>}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
        </Button>
        {product && (
          <Button type="button" variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        )}
      </div>
    </form>
  );
}
