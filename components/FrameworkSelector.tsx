"use client";

import { useMemo, useState } from "react";
import { Search, FileCheck2 } from "lucide-react";
import { frameworks } from "@/data/frameworks";
import { policies } from "@/data/policies";
import { FrameworkId, FrameworkScore } from "@/lib/types";

export function FrameworkSelector({
  onSelect,
  onSelectPolicies,
  scores,
}: {
  onSelect: (id: FrameworkId) => void;
  onSelectPolicies: () => void;
  scores: Record<FrameworkId, FrameworkScore>;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return frameworks;
    return frameworks.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.shortName.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <section className="mx-auto max-w-7xl px-6 pb-24">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-2xl font-medium">Choose a framework</h2>
        <div className="relative w-full sm:w-72">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search standards..."
            className="w-full rounded-md border bg-transparent py-2 pl-9 pr-3 text-sm outline-none focus:border-[var(--color-emerald)]"
            style={{ borderColor: "var(--border)" }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((f) => {
          const score = scores[f.id];
          return (
            <button
              key={f.id}
              onClick={() => onSelect(f.id)}
              className="group flex flex-col rounded-xl border p-5 text-left transition-colors hover:border-[var(--border-strong)]"
              style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
            >
              <div className="mb-3 flex items-center justify-between">
                <span
                  className="rounded-md px-2 py-1 text-xs font-medium"
                  style={{ background: `${f.color}1a`, color: f.color }}
                >
                  {f.shortName}
                </span>
                <span className="font-mono text-xs text-[var(--text-muted)]">
                  {f.controls.length} controls
                </span>
              </div>
              <h3 className="font-display mb-1.5 text-lg font-medium leading-snug">
                {f.name}
              </h3>
              <p className="mb-4 line-clamp-2 text-sm text-[var(--text-muted)]">
                {f.description}
              </p>
              <div className="mt-auto flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>{f.domains.length} domains</span>
                {score && score.total > 0 && (score.covered + score.partial + score.gap > 0) ? (
                  <span className="font-medium" style={{ color: "var(--color-emerald)" }}>
                    {score.readinessPct}% ready
                  </span>
                ) : (
                  <span>Not started</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={onSelectPolicies}
        className="mt-4 flex w-full items-center justify-between rounded-xl border p-5 text-left transition-colors hover:border-[var(--border-strong)]"
        style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-3">
          <FileCheck2 size={18} style={{ color: "var(--color-cyan)" }} />
          <div>
            <h3 className="font-display text-lg font-medium">Policy Checklist</h3>
            <p className="text-sm text-[var(--text-muted)]">
              {policies.length} governance policies referenced across standards
            </p>
          </div>
        </div>
      </button>
    </section>
  );
}
