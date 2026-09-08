"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Product, ProductImage } from "@prisma/client";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toaster";

type ProductWithImages = Product & { images: ProductImage[] };

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
    priceInPaise: product ? (product.priceInPaise / 100).toString() : "",
    fabric: product?.fabric ?? "",
    description: product?.description ?? "",
    stock: product?.stock?.toString() ?? "0",
    blouseIncluded: product?.blouseIncluded ?? true,
    isPublished: product?.isPublished ?? false,
  });
  const [images, setImages] = useState<
    { url: string; alt: string; sortOrder: number }[]
  >(
    product?.images.map((img, i) => ({
      url: img.url,
      alt: img.alt,
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

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("alt", `${form.name || "Saree"} image`);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setImages((prev) => [
        ...prev,
        { url: data.url, alt: data.alt, sortOrder: prev.length },
      ]);
      toast({ title: "Image uploaded" });
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        priceInPaise: Math.round(parseFloat(form.priceInPaise) * 100),
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
      <div>
        <Label htmlFor="price">Price (₹)</Label>
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
        <Label htmlFor="fabric">Fabric</Label>
        <Input
          id="fabric"
          required
          value={form.fabric}
          onChange={(e) => setForm({ ...form, fabric: e.target.value })}
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
        <Label>Images</Label>
        <div className="mt-2 flex flex-wrap gap-3">
          {images.map((img, i) => (
            <div key={i} className="relative h-24 w-20 overflow-hidden rounded-md">
              <Image src={img.url} alt={img.alt} fill className="object-cover" />
            </div>
          ))}
        </div>
        <Input
          type="file"
          accept="image/*"
          className="mt-2"
          onChange={handleImageUpload}
          disabled={uploading}
        />
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
