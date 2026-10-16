import { NextResponse } from "next/server";
import {
  parseIndiapostWebhookBody,
  processIndiapostBookingWebhook,
  verifyIndiapostWebhookRequest,
} from "@/lib/indiapost-webhook";

export async function POST(request: Request) {
  const rawBody = await request.text();

  if (!verifyIndiapostWebhookRequest(rawBody, request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const payloads = parseIndiapostWebhookBody(body);
  if (payloads.length === 0) {
    return NextResponse.json({ received: true, processed: 0 });
  }

  const result = await processIndiapostBookingWebhook(payloads);

  return NextResponse.json({ received: true, ...result });
}
