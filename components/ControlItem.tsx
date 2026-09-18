"use client";

import { useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
import { Control, ControlAssessment, ControlStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<
  Exclude<ControlStatus, "unmarked">,
  { label: string; color: string }
> = {
  covered: { label: "Covered", color: "var(--color-emerald)" },
  partial: { label: "Partial", color: "var(--color-amber)" },
  gap: { label: "Gap", color: "var(--color-rose)" },
  na: { label: "N/A", color: "var(--text-muted)" },
};

export function ControlItem({
  control,
  assessment,
  onStatusChange,
  onNotesChange,
}: {
  control: Control;
  assessment?: ControlAssessment;
  onStatusChange: (status: ControlStatus) => void;
  onNotesChange: (notes: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const status = assessment?.status ?? "unmarked";

  return (
    <div
      className="rounded-lg border transition-colors"
      style={{
        borderColor: status === "gap" ? "color-mix(in srgb, var(--color-rose) 40%, var(--border))" : "var(--border)",
        background: "var(--bg-elevated)",
      }}
    >
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex flex-1 items-start gap-3 text-left"
        >
          <ChevronDown
            size={16}
            className={cn("mt-1 shrink-0 text-[var(--text-muted)] transition-transform", open && "rotate-180")}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[var(--text-muted)]">{control.ref}</span>
              {control.essential && (
                <span
                  className="rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                  style={{ background: "color-mix(in srgb, var(--color-cyan) 15%, transparent)", color: "var(--color-cyan)" }}
                >
                  Audit essential
                </span>
              )}
            </div>
            <p className="mt-0.5 font-medium leading-snug">{control.title}</p>
          </div>
        </button>

        <div className="flex shrink-0 gap-1.5 pl-7 sm:pl-0">
          {(["covered", "partial", "gap", "na"] as const).map((s) => (
            <button
              key={s}
              onClick={() => onStatusChange(s)}
              className="rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors"
              style={{
                borderColor: status === s ? STATUS_CONFIG[s].color : "var(--border)",
                background: status === s ? `color-mix(in srgb, ${STATUS_CONFIG[s].color} 15%, transparent)` : "transparent",
                color: status === s ? STATUS_CONFIG[s].color : "var(--text-muted)",
              }}
            >
              {STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
      </div>

      {open && (
        <div
          className="space-y-3 border-t px-4 py-4 pl-11 text-sm"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <p className="mb-1 text-xs font-medium uppercase-none text-[var(--text-muted)]">Objective</p>
            <p>{control.objective}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-[var(--text-muted)]">Implementation guide</p>
            <p>{control.implementationGuide}</p>
          </div>
          {control.evidenceRequired.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-medium text-[var(--text-muted)]">Evidence typically required</p>
              <div className="flex flex-wrap gap-1.5">
                {control.evidenceRequired.map((e) => (
                  <span
                    key={e}
                    className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <FileText size={11} />
                    {e}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div>
            <p className="mb-1 text-xs font-medium text-[var(--text-muted)]">Notes / evidence tags</p>
            <textarea
              value={assessment?.notes ?? ""}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Add notes, evidence links, or remediation owner..."
              rows={2}
              className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-emerald)]"
              style={{ borderColor: "var(--border)" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
