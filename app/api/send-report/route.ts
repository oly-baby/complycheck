import { NextRequest, NextResponse } from "next/server";

interface SendReportPayload {
  email: string;
  companyName: string;
  frameworkName: string;
  readinessPct: number;
  gapCount: number;
  riskLevel: string;
}

export async function POST(req: NextRequest) {
  let payload: SendReportPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  if (!payload.email || !payload.email.includes("@")) {
    return NextResponse.json({ ok: false, error: "A valid email is required" }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;

  if (resendKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.REPORT_FROM_EMAIL ?? "ComplyCheck <reports@complycheck.app>",
          to: payload.email,
          subject: `Your ${payload.frameworkName} Gap Assessment Report`,
          html: `
            <p>Hi,</p>
            <p>Here's a summary of your ${payload.frameworkName} assessment for ${payload.companyName || "your organization"}:</p>
            <ul>
              <li>Readiness: ${payload.readinessPct}%</li>
              <li>Open gaps: ${payload.gapCount}</li>
              <li>Risk level: ${payload.riskLevel}</li>
            </ul>
            <p>Re-open ComplyCheck in your browser to download the full PDF report.</p>
          `,
        }),
      });

      if (!res.ok) {
        const detail = await res.text();
        console.error("Resend delivery failed", detail);
        return NextResponse.json({ ok: false, error: "Delivery provider error" }, { status: 502 });
      }

      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error("send-report error", err);
      return NextResponse.json({ ok: false, error: "Unexpected error sending email" }, { status: 500 });
    }
  }

  // Graceful fallback: no email provider configured — log the payload so the
  // request isn't silently lost, and tell the client delivery isn't wired up yet.
  console.log("[send-report] No RESEND_API_KEY configured. Payload:", payload);
  return NextResponse.json(
    {
      ok: false,
      error: "Email delivery isn't configured on this deployment yet. Set RESEND_API_KEY.",
    },
    { status: 501 }
  );
}
