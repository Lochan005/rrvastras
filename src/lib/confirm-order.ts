import { prisma } from "@/lib/db";

/** Marks a pending order paid and decrements stock once, even if webhook and return race. */
export async function confirmPaidOrder(lookupId: string) {
  const order = await prisma.order.findFirst({
    where: {
      OR: [{ id: lookupId }, { cashfreeOrderId: lookupId }],
    },
    include: { items: true },
  });

  if (!order || order.status !== "pending_payment") return order;

  const updated = await prisma.order.updateMany({
    where: { id: order.id, status: "pending_payment" },
    data: { status: "confirmed" },
  });

  if (updated.count === 0) return order;

  for (const item of order.items) {
    if (!item.productId) continue;
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    });
  }

  return prisma.order.findUnique({ where: { id: order.id } });
}
