import { getSiteUrl } from "@/lib/utils";

interface CashfreeOrderPayload {
  orderId: string;
  orderAmount: number;
  orderCurrency: string;
  customerDetails: {
    customerId: string;
    customerEmail: string;
    customerPhone: string;
  };
  orderMeta: {
    returnUrl: string;
    notifyUrl: string;
  };
}

function getCashfreeBaseUrl(): string {
  return process.env.CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";
}

function getCashfreeHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    "x-client-id": process.env.CASHFREE_APP_ID!,
    "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
    "x-api-version": "2023-08-01",
  };
}

export async function createCashfreeOrder(payload: CashfreeOrderPayload) {
  const response = await fetch(`${getCashfreeBaseUrl()}/orders`, {
    method: "POST",
    headers: getCashfreeHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Cashfree order creation failed: ${error}`);
  }

  return response.json() as Promise<{
    order_id: string;
    payment_session_id: string;
  }>;
}

export async function verifyCashfreeOrder(orderId: string) {
  const response = await fetch(`${getCashfreeBaseUrl()}/orders/${orderId}`, {
    method: "GET",
    headers: getCashfreeHeaders(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Cashfree order verification failed: ${error}`);
  }

  return response.json() as Promise<{
    order_id: string;
    order_status: string;
    order_amount: number;
  }>;
}

export function buildCashfreeReturnUrl(orderId: string): string {
  return `${getSiteUrl()}/orders/${orderId}?payment=return`;
}

export function buildCashfreeNotifyUrl(): string {
  return `${getSiteUrl()}/api/webhooks/cashfree`;
}

export function isCashfreeConfigured(): boolean {
  return Boolean(
    process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY
  );
}
