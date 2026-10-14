import type { ShipmentStatus } from "@prisma/client";

export const SHIPMENT_STATUS_COPY: Record<
  ShipmentStatus,
  { label: string; tone?: "success" | "warning" | "destructive" | "default" }
> = {
  pending_booking: { label: "Awaiting India Post booking" },
  booked: { label: "Booked with India Post", tone: "default" },
  in_transit: { label: "In transit", tone: "default" },
  out_for_delivery: { label: "Out for delivery", tone: "default" },
  on_hold: { label: "On hold", tone: "warning" },
  delivered: { label: "Delivered", tone: "success" },
  delivery_failed: { label: "Delivery failed", tone: "destructive" },
  returned: { label: "Returned", tone: "warning" },
  redirected: { label: "Redirected", tone: "warning" },
  exception: { label: "Delivery exception", tone: "destructive" },
};
