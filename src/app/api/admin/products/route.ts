import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { NextResponse } from "next/server";

async function checkAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return null;
  }
  return session;
}

export async function GET() {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const products = await prisma.product.findMany({
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const {
    name,
    slug,
    priceInPaise,
    fabric,
    description,
    stock,
    blouseIncluded,
    isPublished,
    images,
  } = body;

  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug: slug || slugify(name),
      priceInPaise,
      fabric,
      description: description ?? "",
      stock: stock ?? 1,
      blouseIncluded: blouseIncluded ?? true,
      isPublished: isPublished ?? false,
      images: {
        create: (images ?? []).map(
          (img: { url: string; alt: string; sortOrder: number }, i: number) => ({
            url: img.url,
            alt: img.alt || name,
            sortOrder: img.sortOrder ?? i,
          })
        ),
      },
    },
    include: { images: true },
  });

  return NextResponse.json(product, { status: 201 });
}
