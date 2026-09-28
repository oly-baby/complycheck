"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Search, Filter } from "lucide-react";
import { Framework, ControlAssessment, ControlStatus, FrameworkScore, MerchantLevel } from "@/lib/types";
import { getMerchantLevelInfo, merchantLevelAnswerId } from "@/lib/merchantLevels";
import { ControlItem } from "./ControlItem";
import { LiveScoreCard } from "./LiveScoreCard";
import { DomainBreakdown } from "./DomainBreakdown";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: { id: ControlStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "covered", label: "Covered" },
  { id: "partial", label: "Partial" },
  { id: "gap", label: "Gap" },
  { id: "na", label: "N/A" },
  { id: "unmarked", label: "Unmarked" },
];

export function AssessmentChecklist({
  framework,
  assessments,
  score,
  merchantLevel,
  onMerchantLevelChange,
  onBack,
  onStatusChange,
  onNotesChange,
  onExport,
}: {
  framework: Framework;
  assessments: Record<string, ControlAssessment>;
  score: FrameworkScore;
  merchantLevel: MerchantLevel | null;
  onMerchantLevelChange: (level: MerchantLevel | null) => void;
  onBack: () => void;
  onStatusChange: (controlId: string, status: ControlStatus) => void;
  onNotesChange: (controlId: string, notes: string) => void;
  onExport: () => void;
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ControlStatus | "all">("all");
  const [domainFilter, setDomainFilter] = useState<string>("all");
  const [essentialsOnly, setEssentialsOnly] = useState(false);
  // SOC 2 Type I/II filter
  const [socTypeFilter] = useState<"all" | "I" | "II" | "both">("all");
  // SOC 2 Type I/II question selector (Step 1)
  const [soc2TypeQuestionFilter, setSoc2TypeQuestionFilter] = useState<"I" | "II" | null>(null);

  const isPci = framework.id === "pciDss";
  const selectedMerchantLevel = getMerchantLevelInfo(framework, isPci ? merchantLevel : null) ?? null;
  /** Step 1 for PCI-DSS: no level chosen yet, so no assessment content is shown. */
  const pciStepOne = isPci && !selectedMerchantLevel;

  const activeDomainFilter =
    domainFilter !== "all" && framework.domains.some((d) => d.id === domainFilter)
      ? domainFilter
      : "all";

  const filteredControls = useMemo(() => {
    const q = query.trim().toLowerCase();
    return framework.controls.filter((c) => {
      const status = assessments[c.id]?.status ?? "unmarked";
      if (statusFilter !== "all" && status !== statusFilter) return false;
      if (activeDomainFilter !== "all" && c.domainId !== activeDomainFilter) return false;
      if (essentialsOnly && !c.essential) return false;
      // SOC 2 Type filter
      if (framework.id === "soc2" && socTypeFilter !== "all") {
        if (!c.socType) return false;
        if (socTypeFilter === "I" && c.socType !== "I" && c.socType !== "both") return false;
        if (socTypeFilter === "II" && c.socType !== "II" && c.socType !== "both") return false;
        if (socTypeFilter === "both" && c.socType !== "both") return false;
      }
      if (q && !(c.title.toLowerCase().includes(q) || c.ref.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [framework.controls, assessments, statusFilter, activeDomainFilter, essentialsOnly, query, socTypeFilter, framework.id]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filteredControls>();
    for (const c of filteredControls) {
      const list = map.get(c.domainId) ?? [];
      list.push(c);
      map.set(c.domainId, list);
    }
    return map;
  }, [filteredControls]);

  const selectedSoc2Type = soc2TypeQuestionFilter && framework.id === "soc2" && framework.soc2Types
    ? framework.soc2Types.find((s) => s.type === soc2TypeQuestionFilter)
    : null;

  return (
    <section className="mx-auto max-w-7xl px-6 pb-24">
      <button
        onClick={onBack}
        className="mb-5 flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)]"
      >
        <ArrowLeft size={14} />
        All frameworks
      </button>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span
            className="rounded-md px-2 py-1 text-xs font-medium"
            style={{ background: `${framework.color}1a`, color: framework.color }}
          >
            {framework.shortName} · {framework.version}
          </span>
          <h1 className="font-display mt-2 text-3xl font-medium tracking-tight">
            {framework.name}
          </h1>
          <p className="mt-1.5 max-w-3xl text-sm text-[var(--text-muted)]">
            {framework.description}
          </p>
        </div>
      </div>

      {pciStepOne ? (
        <div className="max-w-3xl">
          <div
            className="rounded-xl border p-4"
            style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
          >
            <div className="mb-3 flex items-center gap-2">
              <Filter size={14} style={{ color: "var(--color-amber)" }} />
              <p className="text-sm font-medium">Step 1 — Choose your merchant level</p>
            </div>
            <p className="mb-4 text-xs text-[var(--text-muted)]">
              Your merchant level is set by your annual card transaction volume. It determines the
              questionnaire you answer and how you validate compliance: Level 1 is validated by an
              on-site QSA assessment producing a Report on Compliance plus a signed Attestation of
              Compliance, while Levels 2-4 complete a Self-Assessment Questionnaire and sign an
              Attestation of Compliance.
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {framework.merchantLevels?.map((level) => (
                <button
                  key={level.level}
                  onClick={() => onMerchantLevelChange(level.level)}
                  className="rounded-lg border p-3 text-left transition-colors hover:border-[var(--border-strong)]"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-medium" style={{ color: framework.color }}>
                      {level.name}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">
                      {level.questions.length} questions
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] leading-snug text-[var(--text-muted)]">
                    {level.transactionVolumeRange}
                  </p>
                  <p className="mt-1 text-[11px] font-medium">{level.assessmentMethod}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          {/* PCI-DSS merchant level questionnaire (Step 2) */}
          {isPci && selectedMerchantLevel && (
            <div
              className="mb-5 rounded-xl border p-4"
              style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Filter size={14} style={{ color: "var(--color-amber)" }} />
                  <p className="text-sm font-medium">
                    Step 2 — {selectedMerchantLevel.name} questionnaire
                  </p>
                </div>
                <button
                  onClick={() => onMerchantLevelChange(null)}
                  className="flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs text-[var(--text-muted)] hover:text-[var(--text)]"
                  style={{ borderColor: "var(--border)" }}
                >
                  <ArrowLeft size={12} />
                  Change merchant level
                </button>
              </div>
              <p className="mb-3 text-xs text-[var(--text-muted)]">
                {selectedMerchantLevel.transactionVolumeRange} · {selectedMerchantLevel.assessmentMethod}.{" "}
                {selectedMerchantLevel.questions.length} questions — answer each one for{" "}
                {selectedMerchantLevel.name}.
              </p>
              <div className="mb-3 rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "var(--border)", background: "var(--bg-sunken)" }}>
                <p className="font-medium">{selectedMerchantLevel.description}</p>
              </div>
              <div className="space-y-2">
                {selectedMerchantLevel.questions.map((q) => {
                  const questionId = merchantLevelAnswerId(selectedMerchantLevel.level, q.ref);
                  const status = assessments[questionId]?.status ?? "unmarked";
                  return (
                    <div
                      key={questionId}
                      className="rounded-lg border px-3 py-2.5"
                      style={{ borderColor: "var(--border)", background: "var(--bg-sunken)" }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-[10px] font-mono font-medium" style={{ color: framework.color }}>
                            {q.ref}{q.pciRequirement ? ` · PCI Req ${q.pciRequirement}` : ""}
                          </p>
                          <p className="mt-0.5 text-xs leading-relaxed text-[var(--text)]">{q.text}</p>
                        </div>
                        <select
                          value={status}
                          onChange={(e) => onStatusChange(questionId, e.target.value as ControlStatus)}
                          className="rounded-md border bg-transparent px-2 py-1 text-[11px] outline-none"
                          style={{ borderColor: "var(--border)" }}
                        >
                          <option value="unmarked">Unmarked</option>
                          <option value="covered">Covered</option>
                          <option value="partial">Partial</option>
                          <option value="gap">Gap</option>
                          <option value="na">N/A</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SOC 2 Type I/II question selector */}
          {framework.id === "soc2" && framework.soc2Types && (
            <div
              className="mb-5 rounded-xl border p-4"
              style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
            >
              <div className="mb-3 flex items-center gap-2">
                <Filter size={14} style={{ color: framework.color }} />
                <p className="text-sm font-medium">Step 1 — Choose your SOC 2 Report Type</p>
              </div>
              <p className="mb-3 text-xs text-[var(--text-muted)]">
                <strong>Type I</strong> asks &quot;Do you HAVE the control designed and in place?&quot; (point-in-time).
                <strong className="ml-1">Type II</strong> asks &quot;Is the control OPERATING EFFECTIVELY over a period?&quot;.
                Pick a type to see the named TSC questions.
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {framework.soc2Types.map((t) => {
                  const isSelected = soc2TypeQuestionFilter === t.type;
                  return (
                    <button
                      key={t.type}
                      onClick={() => setSoc2TypeQuestionFilter(isSelected ? null : t.type)}
                      className="rounded-lg border p-3 text-left transition-colors"
                      style={{
                        borderColor: isSelected ? framework.color : "var(--border)",
                        background: isSelected ? `${framework.color}10` : "transparent",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium" style={{ color: framework.color }}>{t.name}</span>
                        <span className="text-[10px] text-[var(--text-muted)]">{t.aicpaCriteriaCount}</span>
                      </div>
                      <p className="mt-1 text-[11px] leading-snug text-[var(--text-muted)]">{t.targetAudience}</p>
                      <p className="mt-1 text-[10px] text-[var(--text-muted)]">{t.questions.length} TSC questions</p>
                    </button>
                  );
                })}
              </div>
              {selectedSoc2Type && (
                <div
                  className="mt-3 rounded-lg border px-3 py-2 text-xs"
                  style={{ borderColor: "var(--border)", background: "var(--bg-sunken)" }}
                >
                  <p className="font-medium">{selectedSoc2Type.name} — {selectedSoc2Type.description}</p>
                </div>
              )}

              {/* SOC 2 Questions List */}
              {selectedSoc2Type && selectedSoc2Type.questions && selectedSoc2Type.questions.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium">
                    Step 2 — Answer each TSC question
                    <span className="ml-2 text-[var(--text-muted)]">({selectedSoc2Type.questions.length} questions)</span>
                  </p>
                  <div className="space-y-2">
                    {selectedSoc2Type.questions.map((q) => {
                      const syntheticId = `soc2-${selectedSoc2Type.type}-${q.ref}`;
                      const status = assessments[syntheticId]?.status ?? "unmarked";
                      const typeIOrII = selectedSoc2Type.type;
                      return (
                        <div
                          key={syntheticId}
                          className="rounded-lg border px-3 py-2.5"
                          style={{ borderColor: "var(--border)", background: "var(--bg-sunken)" }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="text-[10px] font-mono font-medium" style={{ color: framework.color }}>
                                {q.ref} · TSC {typeIOrII}
                              </p>
                              <p className="mt-0.5 text-[11px] font-medium text-[var(--text)]">{q.text}</p>
                              <p className="mt-1.5 text-[10px] leading-relaxed text-[var(--text-muted)]">
                                {typeIOrII === "I" ? q.typeIQuestion : q.typeIIQuestion}
                              </p>
                              <div className="mt-1.5 flex flex-wrap gap-1">
                                {(typeIOrII === "I" ? q.evidenceTypeI : q.evidenceTypeII).slice(0, 3).map((e, i) => (
                                  <span
                                    key={i}
                                    className="rounded-full px-1.5 py-0.5 text-[9px]"
                                    style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}
                                  >
                                    {e}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <select
                              value={status}
                              onChange={(e) => onStatusChange(syntheticId, e.target.value as ControlStatus)}
                              className="rounded-md border bg-transparent px-2 py-1 text-[11px] outline-none"
                              style={{ borderColor: "var(--border)" }}
                            >
                              <option value="unmarked">Unmarked</option>
                              <option value="covered">Covered</option>
                              <option value="partial">Partial</option>
                              <option value="gap">Gap</option>
                              <option value="na">N/A</option>
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Control checklist — PCI-DSS is assessed through its level questionnaire */}
          {!isPci && (
            <>
            <div
              className="mb-5 flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center"
              style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
            >
              <div className="relative flex-1">
                <Search
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search controls..."
                  className="w-full rounded-md border bg-transparent py-1.5 pl-8 pr-3 text-sm outline-none focus:border-[var(--color-emerald)]"
                  style={{ borderColor: "var(--border)" }}
                />
              </div>
              <select
                value={activeDomainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                className="rounded-md border bg-transparent px-2 py-1.5 text-sm outline-none"
                style={{ borderColor: "var(--border)" }}
              >
                <option value="all">All domains</option>
                {framework.domains.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setEssentialsOnly((v) => !v)}
                className="rounded-md border px-3 py-1.5 text-sm"
                style={{
                  borderColor: essentialsOnly ? "var(--color-cyan)" : "var(--border)",
                  color: essentialsOnly ? "var(--color-cyan)" : "var(--text-muted)",
                }}
              >
                Audit essentials
              </button>
            </div>

            <div className="mb-5 flex flex-wrap gap-1.5">
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStatusFilter(s.id)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs transition-colors",
                    statusFilter === s.id ? "text-[var(--text)]" : "text-[var(--text-muted)]"
                  )}
                  style={{
                    borderColor: statusFilter === s.id ? "var(--border-strong)" : "var(--border)",
                    background: statusFilter === s.id ? "var(--bg-sunken)" : "transparent",
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="space-y-8">
              {Array.from(grouped.entries()).map(([domainId, controls]) => {
                const domain = framework.domains.find((d) => d.id === domainId);
                return (
                  <div key={domainId}>
                    <h3 className="mb-3 text-sm font-medium text-[var(--text-muted)]">
                      {domain?.name}
                    </h3>
                    <div className="space-y-2.5">
                      {controls.map((c) => (
                        <ControlItem
                          key={c.id}
                          control={c}
                          assessment={assessments[c.id]}
                          onStatusChange={(status) => onStatusChange(c.id, status)}
                          onNotesChange={(notes) => onNotesChange(c.id, notes)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
              {filteredControls.length === 0 && (
                <p className="py-12 text-center text-sm text-[var(--text-muted)]">
                  No controls match your filters.
                </p>
              )}
            </div>
            </>
          )}
        </div>

        <div className="space-y-5">
          <LiveScoreCard score={score} onExport={onExport} />
          {score.domainScores.length > 0 && <DomainBreakdown domains={score.domainScores} />}
        </div>
      </div>
      )}
    </section>
  );
}
