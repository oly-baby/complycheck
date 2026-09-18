"use client";

import { DomainScore } from "@/lib/types";

export function DomainBreakdown({ domains }: { domains: DomainScore[] }) {
  return (
    <div
      className="rounded-xl border p-5"
      style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
    >
      <h3 className="font-display mb-4 text-base font-medium">Domain breakdown</h3>
      <div className="space-y-4">
        {domains.map((d) => (
          <div key={d.domainId}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-[var(--text)]">{d.domainName}</span>
              <span className="font-mono text-xs text-[var(--text-muted)]">
                {d.readinessPct}%
              </span>
            </div>
            <div className="flex h-2 overflow-hidden rounded-full" style={{ background: "var(--bg-sunken)" }}>
              {d.total > 0 && (
                <>
                  <div style={{ width: `${(d.covered / d.total) * 100}%`, background: "var(--color-emerald)" }} />
                  <div style={{ width: `${(d.partial / d.total) * 100}%`, background: "var(--color-amber)" }} />
                  <div style={{ width: `${(d.gap / d.total) * 100}%`, background: "var(--color-rose)" }} />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
