"use client";

import { useState } from "react";
import { X, CheckCircle2 } from "lucide-react";

export function EmailLeadModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (email: string) => Promise<boolean>;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const ok = await onSubmit(email);
    setStatus(ok ? "sent" : "error");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="w-full max-w-sm rounded-xl border p-6"
        style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
      >
        <div className="mb-4 flex items-start justify-between">
          <h2 className="font-display text-xl font-medium">Email this report</h2>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text)]">
            <X size={18} />
          </button>
        </div>

        {status === "sent" ? (
          <div className="flex flex-col items-center py-4 text-center">
            <CheckCircle2 size={32} style={{ color: "var(--color-emerald)" }} />
            <p className="mt-3 text-sm">
              Sent. Check <span className="font-medium">{email}</span> in a few minutes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-emerald)]"
              style={{ borderColor: "var(--border)" }}
            />
            {status === "error" && (
              <p className="text-xs" style={{ color: "var(--color-rose)" }}>
                Couldn&apos;t send that — download the PDF instead for now.
              </p>
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-md py-2.5 text-sm font-medium text-white disabled:opacity-60"
              style={{ background: "var(--color-emerald)" }}
            >
              {status === "sending" ? "Sending..." : "Send report"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
