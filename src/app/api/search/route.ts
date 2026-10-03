import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

const MAX_RESULTS = 8;

export interface ProductSearchResult {
  slug: string;
  name: string;
  fabric: string;
  priceInPaise: number;
  imageUrl: string | null;
  inStock: boolean;
}

function rank(name: string, fabric: string, query: string): number {
  const n = name.toLowerCase();
  const f = fabric.toLowerCase();
  if (n === query) return 0;
  if (n.startsWith(query)) return 1;
  if (n.includes(query)) return 2;
  if (f === query) return 3;
  if (f.startsWith(query)) return 4;
  return 5;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim().toLowerCase();

  if (query.length < 1) {
    return NextResponse.json({ results: [] });
  }

  const terms = query.split(/\s+/).filter(Boolean).slice(0, 5);
  const where: Prisma.ProductWhereInput = {
    isPublished: true,
    AND: terms.map((term) => ({
      OR: [
        { name: { contains: term, mode: "insensitive" } },
        { fabric: { contains: term, mode: "insensitive" } },
      ],
    })),
  };

  const products = await prisma.product.findMany({
    where,
    select: {
      slug: true,
      name: true,
      fabric: true,
      priceInPaise: true,
      stock: true,
      images: { orderBy: { sortOrder: "asc" }, take: 1, select: { url: true } },
    },
    take: 30,
  });

  const results: ProductSearchResult[] = products
    .sort(
      (a, b) =>
        rank(a.name, a.fabric, query) - rank(b.name, b.fabric, query) ||
        a.name.localeCompare(b.name)
    )
    .slice(0, MAX_RESULTS)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      fabric: p.fabric,
      priceInPaise: p.priceInPaise,
      imageUrl: p.images[0]?.url ?? null,
      inStock: p.stock > 0,
    }));

  return NextResponse.json({ results });
}
