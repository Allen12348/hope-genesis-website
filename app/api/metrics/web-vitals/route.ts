import { NextResponse } from "next/server";
import { safeJsonParse } from "@/lib/utils/safe-json";

type WebVitalsPayload = {
  name?: string;
  value?: number;
  rating?: string;
  id?: string;
};

export async function POST(req: Request) {
  const raw = await req.text();
  const metric = safeJsonParse<WebVitalsPayload>(raw, {});

  console.log("[WEB_VITALS]", {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    id: metric.id,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
