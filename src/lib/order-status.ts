/** Admin / internal order status labels. */
export const ORDER_STATUS_COPY: Record<
  string,
  { label: string; active?: boolean; shipped?: boolean }
> = {
  pending_payment: { label: "Awaiting payment" },
  confirmed: { label: "Paid — ready to fulfill", active: true },
  shipped: { label: "Dispatched", shipped: true },
  delivered: { label: "Delivered", shipped: true },
  returned: { label: "Returned", shipped: true },
  cancelled: { label: "Cancelled" },
};

/** Paid orders a customer can reopen. Unpaid checkouts and cancellations stay off the profile. */
export const PURCHASED_ORDER_STATUSES = [
  "confirmed",
  "shipped",
  "delivered",
  "returned",
] as const;

/** Customer-facing labels — no carrier or tracking detail. */
export function getCustomerOrderStatus(status: string): {
  label: string;
  active?: boolean;
  complete?: boolean;
} {
  switch (status) {
    case "pending_payment":
      return { label: "Awaiting payment", active: true };
    case "confirmed":
    case "shipped":
      return { label: "Processing", active: true };
    case "delivered":
      return { label: "Delivered", complete: true };
    case "returned":
      return { label: "Returned" };
    case "cancelled":
      return { label: "Cancelled" };
    default:
      return { label: status.replace(/_/g, " ") };
  }
}

export function formatOrderDate(date: Date) {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
