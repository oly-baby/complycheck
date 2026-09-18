"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function OnboardingModal({
  onSubmit,
  onClose,
}: {
  onSubmit: (companyName: string, role: string) => void;
  onClose: () => void;
}) {
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="w-full max-w-md rounded-xl border p-6"
        style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
      >
        <div className="mb-1 flex items-start justify-between">
          <h2 className="font-display text-xl font-medium">Before you begin</h2>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text)]">
            <X size={18} />
          </button>
        </div>
        <p className="mb-5 text-sm text-[var(--text-muted)]">
          This appears on your exported report so reviewers know whose
          assessment they&apos;re reading. It stays on your device unless you
          export or email a report.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(companyName.trim(), role.trim());
          }}
          className="space-y-4"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium">Company name</label>
            <input
              autoFocus
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Acme Cyber Corp"
              className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-emerald)]"
              style={{ borderColor: "var(--border)" }}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Your role</label>
            <input
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="GRC Lead"
              className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-emerald)]"
              style={{ borderColor: "var(--border)" }}
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md py-2.5 text-sm font-medium text-white"
            style={{ background: "var(--color-emerald)" }}
          >
            Continue to frameworks
          </button>
        </form>
      </div>
    </div>
  );
}
