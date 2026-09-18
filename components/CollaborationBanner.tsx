"use client";

import { Mail } from "lucide-react";

export function CollaborationBanner() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-16">
      <div
        className="flex flex-col items-start gap-3 rounded-xl border p-5 sm:flex-row sm:items-center sm:justify-between"
        style={{ background: "var(--bg-sunken)", borderColor: "var(--border)" }}
      >
        <div>
          <p className="font-medium">Have feedback or a framework suggestion?</p>
          <p className="text-sm text-[var(--text-muted)]">
            Help us improve ComplyCheck — suggest a control library, report a gap, or share what you need.
          </p>
        </div>
        <a
          href="mailto:trycomplycheck@gmail.com"
          className="flex shrink-0 items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium"
          style={{ borderColor: "var(--border-strong)" }}
        >
          <Mail size={14} />
          trycomplycheck@gmail.com
        </a>
      </div>
    </div>
  );
}
