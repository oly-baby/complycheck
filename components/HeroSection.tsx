"use client";

import Image from "next/image";
import { useTheme } from "./ThemeProvider";
import { ArrowRight } from "lucide-react";

const FRAMEWORK_TAGS = [
  "ISO 27001",
  "NIST CSF 2.0",
  "SOC 2",
  "PCI-DSS 4.0",
  "GDPR",
  "NIST 800-53",
  "HIPAA",
  "DORA",
  "NDPA",
  "CIS Controls v8",
];

export function HeroSection({ onStart }: { onStart: () => void }) {
  const { theme } = useTheme();
  return (
    <section className="mx-auto max-w-7xl px-6 pb-16 pt-14 sm:pb-24 sm:pt-20">
      <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="mb-7">
            <Image
              src={theme === "dark" ? "/logo-dark.svg" : "/logo.svg"}
              alt="ComplyCheck"
              width={480}
              height={94}
              priority
              className="h-auto w-[220px] sm:w-[280px]"
            />
          </div>
          <h1 className="font-display max-w-xl text-[2.75rem] font-medium leading-[1.08] tracking-tight sm:text-5xl">
            Find your compliance gaps before your auditor does.
          </h1>
          <p className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-[var(--text-muted)]">
            ComplyCheck scores your readiness against major security standards and control frameworks, control by control, and hands you a prioritized gap list with remediation strategies — entirely in your browser. Nothing you enter leaves your device until you choose to export it.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button
              onClick={onStart}
              className="group flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium text-white transition-transform active:scale-[0.98]"
              style={{ background: "var(--color-emerald)" }}
            >
              Start an assessment
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
            <span className="text-sm text-[var(--text-muted)]">
              No signup. No data leaves your browser.
            </span>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {FRAMEWORK_TAGS.map((tag) => (
              <span
                key={tag}
                className="rounded-full border px-3 py-1 text-xs text-[var(--text-muted)]"
                style={{ borderColor: "var(--border)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <div
            className="rounded-2xl border p-6 shadow-xl"
            style={{
              background: "var(--bg-elevated)",
              borderColor: "var(--border)",
            }}
          >
            <p className="text-sm font-medium text-[var(--text-muted)]">
              Sample readiness — ISO 27001:2022
            </p>
            <div className="mt-5 flex items-center gap-6">
              <svg viewBox="0 0 120 120" className="h-28 w-28 shrink-0">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="var(--bg-sunken)"
                  strokeWidth="12"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="var(--color-emerald)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 50 * 0.635} ${2 * Math.PI * 50}`}
                  transform="rotate(-90 60 60)"
                />
                <text
                  x="60"
                  y="65"
                  textAnchor="middle"
                  className="font-display"
                  fontSize="26"
                  fill="var(--text)"
                >
                  64%
                </text>
              </svg>
              <div className="flex-1 space-y-2.5">
                <ScoreBar label="Covered" pct={50} color="var(--color-emerald)" />
                <ScoreBar label="Partial" pct={27} color="var(--color-amber)" />
                <ScoreBar label="Gap" pct={23} color="var(--color-rose)" />
              </div>
            </div>
            <div
              className="mt-6 rounded-lg border px-4 py-3 text-xs text-[var(--text-muted)]"
              style={{ borderColor: "var(--border)", background: "var(--bg-sunken)" }}
            >
              6 priority gaps identified — cryptography, endpoint hardening,
              and physical asset controls need attention first.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScoreBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-[var(--text-muted)]">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: "var(--bg-sunken)" }}>
        <div
          className="h-1.5 rounded-full"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
