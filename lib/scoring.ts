import {
  Control,
  ControlAssessment,
  ControlStatus,
  Domain,
  DomainScore,
  Framework,
  FrameworkScore,
} from "./types";

function statusOf(
  controlId: string,
  assessments: Record<string, ControlAssessment>
): ControlStatus {
  return assessments[controlId]?.status ?? "unmarked";
}

function scoreControls(
  controls: Control[],
  assessments: Record<string, ControlAssessment>
) {
  let covered = 0;
  let partial = 0;
  let gap = 0;
  let na = 0;
  let unmarked = 0;

  for (const c of controls) {
    const status = statusOf(c.id, assessments);
    if (status === "covered") covered++;
    else if (status === "partial") partial++;
    else if (status === "gap") gap++;
    else if (status === "na") na++;
    else unmarked++;
  }

  const activeTotal = controls.length - na;
  const readinessPct =
    activeTotal > 0
      ? ((covered * 1 + partial * 0.5) / activeTotal) * 100
      : 0;
  const gapPct = activeTotal > 0 ? (gap / activeTotal) * 100 : 0;

  return {
    total: controls.length,
    covered,
    partial,
    gap,
    na,
    unmarked,
    readinessPct: Math.round(readinessPct * 10) / 10,
    gapPct: Math.round(gapPct * 10) / 10,
  };
}

export function scoreDomain(
  domain: Domain,
  controls: Control[],
  assessments: Record<string, ControlAssessment>
): DomainScore {
  const domainControls = controls.filter((c) => c.domainId === domain.id);
  const s = scoreControls(domainControls, assessments);
  return {
    domainId: domain.id,
    domainName: domain.name,
    total: s.total,
    covered: s.covered,
    partial: s.partial,
    gap: s.gap,
    na: s.na,
    unreadiness: s.unmarked,
    readinessPct: s.readinessPct,
    gapPct: s.gapPct,
  };
}

function riskLevelFor(readinessPct: number, gapPct: number): FrameworkScore["riskLevel"] {
  if (readinessPct >= 85 && gapPct <= 10) return "Low";
  if (readinessPct >= 65 && gapPct <= 25) return "Moderate";
  if (readinessPct >= 40) return "High";
  return "Critical";
}

export function scoreFramework(
  framework: Framework,
  assessments: Record<string, ControlAssessment>
): FrameworkScore {
  const s = scoreControls(framework.controls, assessments);
  const domainScores = framework.domains.map((d) =>
    scoreDomain(d, framework.controls, assessments)
  );

  const topGaps = framework.controls
    .filter((c) => statusOf(c.id, assessments) === "gap")
    .sort((a, b) => (b.essential ? 1 : 0) - (a.essential ? 1 : 0))
    .slice(0, 8);

  return {
    frameworkId: framework.id,
    total: s.total,
    covered: s.covered,
    partial: s.partial,
    gap: s.gap,
    na: s.na,
    unmarked: s.unmarked,
    readinessPct: s.readinessPct,
    gapPct: s.gapPct,
    domainScores,
    riskLevel: riskLevelFor(s.readinessPct, s.gapPct),
    topGaps,
  };
}

export function scoreAllFrameworks(
  frameworks: Framework[],
  assessments: Record<string, ControlAssessment>
): FrameworkScore[] {
  return frameworks.map((f) => scoreFramework(f, assessments));
}
