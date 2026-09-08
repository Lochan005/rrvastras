import { getSiteUrl } from "@/lib/utils";
import type { Product, ProductImage } from "@prisma/client";

type ProductWithImages = Product & { images: ProductImage[] };

export function buildProductJsonLd(product: ProductWithImages) {
  const image = product.images[0];
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: image?.url,
    sku: product.slug,
    brand: {
      "@type": "Brand",
      name: "RR Vastras",
    },
    offers: {
      "@type": "Offer",
      url: `${getSiteUrl()}/shop/${product.slug}`,
      priceCurrency: "INR",
      price: (product.priceInPaise / 100).toFixed(0),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RR Vastras",
    url: getSiteUrl(),
    description:
      "Women's saree e-commerce store offering elegant traditional and contemporary sarees across India.",
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
