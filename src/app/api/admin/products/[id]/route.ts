import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { NextResponse } from "next/server";

async function checkAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") return null;
  return session;
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
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

  await prisma.productImage.deleteMany({ where: { productId: id } });

  const product = await prisma.product.update({
    where: { id },
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

  return NextResponse.json(product);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
