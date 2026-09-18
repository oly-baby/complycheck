import { NextRequest, NextResponse } from "next/server";

interface FeedbackPayload {
  rating: number;
  feedback?: string;
  frameworkName?: string;
}

export async function POST(req: NextRequest) {
  let payload: FeedbackPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof payload.rating !== "number" || payload.rating < 1 || payload.rating > 5) {
    return NextResponse.json({ ok: false, error: "Rating must be between 1 and 5" }, { status: 400 });
  }

  // No persistence layer wired up yet — log so feedback isn't lost, and
  // leave a clear seam for wiring this to a database or Slack webhook.
  console.log("[feedback]", {
    rating: payload.rating,
    feedback: payload.feedback ?? "",
    frameworkName: payload.frameworkName ?? "",
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
