"use client";

import { AlertTriangle, Download } from "lucide-react";
import { FrameworkScore } from "@/lib/types";

const RISK_COLOR: Record<FrameworkScore["riskLevel"], string> = {
  Low: "var(--color-emerald)",
  Moderate: "var(--color-amber)",
  High: "#fb923c",
  Critical: "var(--color-rose)",
};

export function LiveScoreCard({
  score,
  onExport,
}: {
  score: FrameworkScore;
  onExport: () => void;
}) {
  const circumference = 2 * Math.PI * 42;
  const dash = (score.readinessPct / 100) * circumference;

  return (
    <div
      className="sticky top-20 rounded-xl border p-5"
      style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center gap-5">
        <svg viewBox="0 0 100 100" className="h-24 w-24 shrink-0">
          <circle cx="50" cy="50" r="42" fill="none" stroke="var(--bg-sunken)" strokeWidth="10" />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="var(--color-emerald)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
            transform="rotate(-90 50 50)"
            style={{ transition: "stroke-dasharray 0.4s ease" }}
          />
          <text x="50" y="56" textAnchor="middle" className="font-display" fontSize="20" fill="var(--text)">
            {score.readinessPct}%
          </text>
        </svg>
        <div>
          <p className="text-sm font-medium">Audit readiness</p>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs">
            <span
              className="rounded-full px-2 py-0.5 font-medium"
              style={{
                background: `color-mix(in srgb, ${RISK_COLOR[score.riskLevel]} 15%, transparent)`,
                color: RISK_COLOR[score.riskLevel],
              }}
            >
              {score.riskLevel} risk
            </span>
          </div>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            {score.covered} covered · {score.partial} partial · {score.gap} gap
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 text-center">
        <Stat label="Covered" value={score.covered} color="var(--color-emerald)" />
        <Stat label="Partial" value={score.partial} color="var(--color-amber)" />
        <Stat label="Gap" value={score.gap} color="var(--color-rose)" />
      </div>

      {score.topGaps.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)]">
            <AlertTriangle size={12} style={{ color: "var(--color-rose)" }} />
            Top blockers
          </p>
          <ul className="space-y-1.5">
            {score.topGaps.slice(0, 4).map((c) => (
              <li key={c.id} className="flex items-start gap-2 text-xs">
                <span className="font-mono text-[var(--text-muted)]">{c.ref}</span>
                <span className="line-clamp-1">{c.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={onExport}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium text-white"
        style={{ background: "var(--color-navy)" }}
      >
        <Download size={14} />
        Export report
      </button>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-md py-2" style={{ background: "var(--bg-sunken)" }}>
      <p className="font-display text-lg" style={{ color }}>
        {value}
      </p>
      <p className="text-[10px] text-[var(--text-muted)]">{label}</p>
    </div>
  );
}
