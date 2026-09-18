"use client";

import { ArrowLeft } from "lucide-react";
import { policies } from "@/data/policies";
import { PolicyAssessment, ControlStatus } from "@/lib/types";

const STATUS_OPTIONS: { id: ControlStatus; label: string; color: string }[] = [
  { id: "covered", label: "Covered", color: "var(--color-emerald)" },
  { id: "partial", label: "Partial", color: "var(--color-amber)" },
  { id: "gap", label: "Gap", color: "var(--color-rose)" },
  { id: "na", label: "N/A", color: "var(--text-muted)" },
];

export function PolicyChecklist({
  assessments,
  onStatusChange,
  onBack,
}: {
  assessments: Record<string, PolicyAssessment>;
  onStatusChange: (policyId: string, status: ControlStatus) => void;
  onBack: () => void;
}) {
  const requiredCount = policies.filter((p) => p.required).length;
  const coveredCount = policies.filter((p) => assessments[p.id]?.status === "covered").length;

  return (
    <section className="mx-auto max-w-4xl px-6 pb-24">
      <button
        onClick={onBack}
        className="mb-5 flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)]"
      >
        <ArrowLeft size={14} />
        All frameworks
      </button>

      <div className="mb-6">
        <span
          className="rounded-md px-2 py-1 text-xs font-medium"
          style={{ background: "color-mix(in srgb, var(--color-cyan) 15%, transparent)", color: "var(--color-cyan)" }}
        >
          Governance
        </span>
        <h1 className="font-display mt-2 text-3xl font-medium tracking-tight">
          Policy Checklist
        </h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          {coveredCount} of {requiredCount} required policies in place · {policies.length} total policies referenced across standards
        </p>
      </div>

      <div className="space-y-2.5">
        {policies.map((p) => {
          const status = assessments[p.id]?.status ?? "unmarked";
          return (
            <div
              key={p.id}
              className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
              style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{p.name}</p>
                  {p.required && (
                    <span
                      className="rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                      style={{ background: "color-mix(in srgb, var(--color-rose) 12%, transparent)", color: "var(--color-rose)" }}
                    >
                      Required
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-[var(--text-muted)]">{p.description}</p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onStatusChange(p.id, s.id)}
                    className="rounded-md border px-2.5 py-1.5 text-xs font-medium"
                    style={{
                      borderColor: status === s.id ? s.color : "var(--border)",
                      background: status === s.id ? `color-mix(in srgb, ${s.color} 15%, transparent)` : "transparent",
                      color: status === s.id ? s.color : "var(--text-muted)",
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
