export const ORDER_STATUS_COPY: Record<
  string,
  { label: string; active?: boolean; shipped?: boolean }
> = {
  pending_payment: { label: "Awaiting Payment" },
  confirmed: { label: "Confirmed & Preparing Dispatch", active: true },
  shipped: { label: "Shipped", shipped: true },
  cancelled: { label: "Cancelled" },
};

export function formatOrderDate(date: Date) {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
