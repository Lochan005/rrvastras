import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const placeholderProducts = [
  {
    name: "Elegant Silk Saree",
    slug: "elegant-silk-saree",
    priceInPaise: 899900,
    fabric: "Pure Silk",
    description:
      "A timeless silk saree with intricate weaving. Perfect for festive occasions and celebrations.",
    stock: 12,
    blouseIncluded: true,
    isPublished: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1610030469983-98e5507832b3?w=800&q=80",
        alt: "Elegant silk saree in rich maroon with gold border",
        sortOrder: 0,
      },
    ],
  },
  {
    name: "Banarasi Weave Saree",
    slug: "banarasi-weave-saree",
    priceInPaise: 1249900,
    fabric: "Banarasi Silk",
    description:
      "Handwoven Banarasi saree featuring traditional motifs and a luxurious drape.",
    stock: 4,
    blouseIncluded: true,
    isPublished: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1583391735256-15f031d0a4d0?w=800&q=80",
        alt: "Banarasi weave saree in deep red with golden zari work",
        sortOrder: 0,
      },
    ],
  },
  {
    name: "Cotton Handloom Saree",
    slug: "cotton-handloom-saree",
    priceInPaise: 349900,
    fabric: "Cotton",
    description:
      "Lightweight handloom cotton saree ideal for daily wear and casual gatherings.",
    stock: 20,
    blouseIncluded: true,
    isPublished: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1617627143750-d86bc21e0936?w=800&q=80",
        alt: "Soft cotton handloom saree in pastel blue",
        sortOrder: 0,
      },
    ],
  },
  {
    name: "Kanjivaram Classic",
    slug: "kanjivaram-classic",
    priceInPaise: 1599900,
    fabric: "Kanjivaram Silk",
    description:
      "Classic Kanjivaram saree with contrasting border and temple-inspired motifs.",
    stock: 3,
    blouseIncluded: true,
    isPublished: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1610030469983-98e5507832b3?w=800&q=80",
        alt: "Kanjivaram classic saree in emerald green with gold border",
        sortOrder: 0,
      },
    ],
  },
  {
    name: "Chiffon Evening Saree",
    slug: "chiffon-evening-saree",
    priceInPaise: 599900,
    fabric: "Chiffon",
    description:
      "Flowing chiffon saree with delicate embellishments for evening events.",
    stock: 8,
    blouseIncluded: true,
    isPublished: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1583391735256-15f031d0a4d0?w=800&q=80",
        alt: "Chiffon evening saree in soft peach with subtle shimmer",
        sortOrder: 0,
      },
    ],
  },
  {
    name: "Linen Summer Saree",
    slug: "linen-summer-saree",
    priceInPaise: 429900,
    fabric: "Linen",
    description:
      "Breathable linen saree with a modern minimalist appeal for warm weather.",
    stock: 15,
    blouseIncluded: true,
    isPublished: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1617627143750-d86bc21e0936?w=800&q=80",
        alt: "Linen summer saree in natural beige tone",
        sortOrder: 0,
      },
    ],
  },
  {
    name: "Georgette Party Wear",
    slug: "georgette-party-wear",
    priceInPaise: 749900,
    fabric: "Georgette",
    description:
      "Stylish georgette saree with sequin details, perfect for parties and receptions.",
    stock: 6,
    blouseIncluded: true,
    isPublished: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1610030469983-98e5507832b3?w=800&q=80",
        alt: "Georgette party wear saree in royal purple",
        sortOrder: 0,
      },
    ],
  },
  {
    name: "Tussar Silk Heritage",
    slug: "tussar-silk-heritage",
    priceInPaise: 999900,
    fabric: "Tussar Silk",
    description:
      "Heritage tussar silk saree with natural texture and earthy elegance.",
    stock: 0,
    blouseIncluded: true,
    isPublished: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1583391735256-15f031d0a4d0?w=800&q=80",
        alt: "Tussar silk heritage saree in golden brown",
        sortOrder: 0,
      },
    ],
  },
  {
    name: "Organza Festive Saree",
    slug: "organza-festive-saree",
    priceInPaise: 849900,
    fabric: "Organza",
    description:
      "Sheer organza saree with floral embroidery for festive celebrations.",
    stock: 10,
    blouseIncluded: true,
    isPublished: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1617627143750-d86bc21e0936?w=800&q=80",
        alt: "Organza festive saree in coral pink with floral embroidery",
        sortOrder: 0,
      },
    ],
  },
  {
    name: "Placeholder Saree (Draft)",
    slug: "placeholder-saree-draft",
    priceInPaise: 500000,
    fabric: "TBD",
    description: "Placeholder product — details to be updated by admin.",
    stock: 5,
    blouseIncluded: true,
    isPublished: false,
    images: [
      {
        url: "https://placehold.co/800x1000/e8e8e8/666666?text=RR+Vastras",
        alt: "Placeholder saree image for RR Vastras",
        sortOrder: 0,
      },
    ],
  },
];

async function main() {
  await prisma.storeSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      shippingFlatPaise: 15000,
      freeShippingMinPaise: 750000,
      lowStockThreshold: 5,
      whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919876543210",
    },
  });

  for (const product of placeholderProducts) {
    const { images, ...data } = product;
    await prisma.product.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        images: { create: images },
      },
    });
  }

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
