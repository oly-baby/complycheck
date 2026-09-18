"use client";

import { useMemo, useState } from "react";
import { X, FileDown, FileSpreadsheet, FileJson, Mail, ChevronDown, ChevronRight, Sparkles } from "lucide-react";
import { Framework, FrameworkScore, STATUS_LABEL } from "@/lib/types";

const STATUS_COLOR: Record<string, string> = {
  Covered: "var(--color-emerald)",
  Partial: "var(--color-amber)",
  Gap: "var(--color-rose)",
  "N/A": "var(--text-muted)",
  Unmarked: "var(--text-muted)",
};

export function ReportSummaryModal({
  framework,
  score,
  state,
  onClose,
  onDownloadPdf,
  onDownloadCsv,
  onDownloadJson,
  onEmailReport,
}: {
  framework: Framework;
  score: FrameworkScore;
  state?: { controlAssessments: Record<string, { status: string; notes?: string }> };
  onClose: () => void;
  onDownloadPdf: () => void;
  onDownloadCsv: () => void;
  onDownloadJson: () => void;
  onEmailReport: () => void;
}) {
  const [showRemediation, setShowRemediation] = useState(true);

  const gapItems = useMemo(() => {
    return framework.controls
      .filter((c) => {
        const status = state?.controlAssessments[c.id]?.status ?? "unmarked";
        return status === "gap" || status === "partial";
      })
      .sort((a, b) => {
        const order: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
        return (order[a.priority ?? "low"] ?? 3) - (order[b.priority ?? "low"] ?? 3);
      });
  }, [framework.controls, state]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border p-6"
        style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="font-display text-xl font-medium">Export Gap Assessment Report</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">{framework.name} · {framework.version}</p>
          </div>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text)]">
            <X size={18} />
          </button>
        </div>

        <div className="mb-5 grid grid-cols-3 gap-2 rounded-lg border p-3 text-center" style={{ borderColor: "var(--border)" }}>
          <div>
            <p className="font-display text-xl" style={{ color: "var(--color-emerald)" }}>
              {score.readinessPct}%
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">Readiness</p>
          </div>
          <div>
            <p className="font-display text-xl" style={{ color: "var(--color-rose)" }}>
              {score.gap}
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">Gaps</p>
          </div>
          <div>
            <p className="font-display text-xl">{score.riskLevel}</p>
            <p className="text-[11px] text-[var(--text-muted)]">Risk level</p>
          </div>
        </div>

        {/* Status breakdown chips */}
        <div className="mb-5 flex flex-wrap gap-1.5 text-xs">
          {(["covered", "partial", "gap", "na"] as const).map((s) => {
            const count = s === "covered" ? score.covered : s === "partial" ? score.partial : s === "gap" ? score.gap : score.na;
            return (
              <span
                key={s}
                className="rounded-md border px-2.5 py-1"
                style={{ borderColor: "var(--border)", color: STATUS_COLOR[STATUS_LABEL[s]] }}
              >
                {STATUS_LABEL[s]}: {count}
              </span>
            );
          })}
        </div>

        {/* Remediation summary */}
        {gapItems.length > 0 && (
          <div className="mb-5 rounded-lg border" style={{ borderColor: "var(--border)" }}>
            <button
              onClick={() => setShowRemediation((v) => !v)}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium"
            >
              <span className="flex items-center gap-2">
                <Sparkles size={14} style={{ color: "var(--color-amber)" }} />
                Top remediation strategies ({gapItems.length} gaps)
              </span>
              {showRemediation ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            {showRemediation && (
              <div className="space-y-2 border-t px-4 py-3 text-sm" style={{ borderColor: "var(--border)" }}>
                {gapItems.slice(0, 6).map((c) => {
                  const status = state?.controlAssessments[c.id]?.status ?? "unmarked";
                  return (
                    <div key={c.id} className="rounded-md border p-2.5" style={{ borderColor: "var(--border)" }}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs text-[var(--text-muted)]">{c.ref}</span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase"
                            style={{
                              background: `color-mix(in srgb, ${STATUS_COLOR[STATUS_LABEL[status as keyof typeof STATUS_LABEL] ?? "Unmarked"]} 15%, transparent)`,
                              color: STATUS_COLOR[STATUS_LABEL[status as keyof typeof STATUS_LABEL] ?? "Unmarked"],
                            }}
                          >
                            {STATUS_LABEL[status as keyof typeof STATUS_LABEL] ?? "Unmarked"}
                          </span>
                          <span
                            className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase"
                            style={{
                              background: `color-mix(in srgb, ${STATUS_COLOR[c.priority === "critical" ? "Gap" : c.priority === "high" ? "Partial" : "N/A"]} 15%, transparent)`,
                              color: c.priority === "critical" ? "var(--color-rose)" : c.priority === "high" ? "var(--color-amber)" : "var(--text-muted)",
                            }}
                          >
                            {c.priority ?? "low"}
                          </span>
                        </div>
                      </div>
                      <p className="mt-1 font-medium leading-snug">{c.title}</p>
                      {c.remediationStrategy && (
                        <p className="mt-1 text-xs text-[var(--text-muted)]">
                          <span className="font-medium">Remediation:</span> {c.remediationStrategy}
                        </p>
                      )}
                    </div>
                  );
                })}
                {gapItems.length > 6 && (
                  <p className="text-center text-xs text-[var(--text-muted)]">
                    +{gapItems.length - 6} more — see full PDF report for complete roadmap.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <button
            onClick={onDownloadPdf}
            className="flex w-full items-center gap-3 rounded-md py-2.5 pl-4 text-sm font-medium text-white"
            style={{ background: "var(--color-navy)" }}
          >
            <FileDown size={16} />
            Download detailed PDF report
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onDownloadCsv}
              className="flex items-center justify-center gap-2 rounded-md border py-2.5 text-sm"
              style={{ borderColor: "var(--border)" }}
            >
              <FileSpreadsheet size={15} />
              CSV
            </button>
            <button
              onClick={onDownloadJson}
              className="flex items-center justify-center gap-2 rounded-md border py-2.5 text-sm"
              style={{ borderColor: "var(--border)" }}
            >
              <FileJson size={15} />
              JSON
            </button>
          </div>
          <button
            onClick={onEmailReport}
            className="flex w-full items-center justify-center gap-2 rounded-md border py-2.5 text-sm"
            style={{ borderColor: "var(--border)" }}
          >
            <Mail size={15} />
            Email me this report
          </button>
        </div>
      </div>
    </div>
  );
}
