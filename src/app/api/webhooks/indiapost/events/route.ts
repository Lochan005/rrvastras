import { NextResponse } from "next/server";
import {
  parseIndiapostWebhookBody,
  processIndiapostEventsWebhook,
  verifyIndiapostWebhookSignature,
} from "@/lib/indiapost-webhook";

export async function POST(request: Request) {
  const rawBody = await request.text();

  if (!verifyIndiapostWebhookSignature(rawBody, request)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
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

  const result = await processIndiapostEventsWebhook(payloads);

  return NextResponse.json({ received: true, ...result });
}
