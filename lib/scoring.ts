import {
  Control,
  ControlAssessment,
  ControlStatus,
  Domain,
  DomainScore,
  Framework,
  FrameworkScore,
  MerchantLevel,
} from "./types";
import { merchantLevelItems } from "./merchantLevels";

function statusOf(
  controlId: string,
  assessments: Record<string, ControlAssessment>
): ControlStatus {
  return assessments[controlId]?.status ?? "unmarked";
}

function scoreStatuses(statuses: ControlStatus[]) {
  let covered = 0;
  let partial = 0;
  let gap = 0;
  let na = 0;
  let unmarked = 0;

  for (const status of statuses) {
    if (status === "covered") covered++;
    else if (status === "partial") partial++;
    else if (status === "gap") gap++;
    else if (status === "na") na++;
    else unmarked++;
  }

  const activeTotal = statuses.length - na;
  const readinessPct =
    activeTotal > 0
      ? ((covered * 1 + partial * 0.5) / activeTotal) * 100
      : 0;
  const gapPct = activeTotal > 0 ? (gap / activeTotal) * 100 : 0;

  return {
    total: statuses.length,
    covered,
    partial,
    gap,
    na,
    unmarked,
    readinessPct: Math.round(readinessPct * 10) / 10,
    gapPct: Math.round(gapPct * 10) / 10,
  };
}

function scoreControls(
  controls: Control[],
  assessments: Record<string, ControlAssessment>
) {
  return scoreStatuses(controls.map((c) => statusOf(c.id, assessments)));
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
  const domainScores = framework.domains
    .map((d) => scoreDomain(d, framework.controls, assessments))
    .filter((d) => d.total > 0);

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

function emptyScore(frameworkId: Framework["id"]): FrameworkScore {
  return {
    frameworkId,
    total: 0,
    covered: 0,
    partial: 0,
    gap: 0,
    na: 0,
    unmarked: 0,
    readinessPct: 0,
    gapPct: 0,
    domainScores: [],
    riskLevel: "Low",
    topGaps: [],
  };
}

/**
 * PCI-DSS readiness is measured from the questionnaire of the merchant level the
 * user selected, not from the Requirement 1-12 control reference list.
 */
export function scoreMerchantLevel(
  framework: Framework,
  level: MerchantLevel | null | undefined,
  assessments: Record<string, ControlAssessment>
): FrameworkScore {
  if (framework.id !== "pciDss" || !level) return emptyScore(framework.id);

  const items = merchantLevelItems(framework, level, assessments);
  if (items.length === 0) return emptyScore(framework.id);

  const s = scoreStatuses(items.map((i) => i.status));

  // Group questionnaire answers by the PCI DSS requirement they evidence so the
  // domain breakdown stays meaningful without the control checklist.
  const byRequirement = new Map<number, typeof items>();
  const unassigned: typeof items = [];
  for (const item of items) {
    if (item.primaryRequirement === null) {
      unassigned.push(item);
      continue;
    }
    const list = byRequirement.get(item.primaryRequirement) ?? [];
    list.push(item);
    byRequirement.set(item.primaryRequirement, list);
  }

  const domainScores: DomainScore[] = [...byRequirement.entries()]
    .sort(([a], [b]) => a - b)
    .map(([requirement, group]) => {
      const gs = scoreStatuses(group.map((i) => i.status));
      return {
        domainId: `pci-${requirement}`,
        domainName: `Requirement ${requirement}`,
        total: gs.total,
        covered: gs.covered,
        partial: gs.partial,
        gap: gs.gap,
        na: gs.na,
        unreadiness: gs.unmarked,
        readinessPct: gs.readinessPct,
        gapPct: gs.gapPct,
      };
    });

  if (unassigned.length > 0) {
    const us = scoreStatuses(unassigned.map((i) => i.status));
    domainScores.push({
      domainId: "pci-other",
      domainName: "General PCI DSS obligations",
      total: us.total,
      covered: us.covered,
      partial: us.partial,
      gap: us.gap,
      na: us.na,
      unreadiness: us.unmarked,
      readinessPct: us.readinessPct,
      gapPct: us.gapPct,
    });
  }

  const topGaps = items
    .filter((i) => i.status === "gap")
    .slice(0, 8)
    .map<Control>((i) => ({
      id: i.id,
      domainId: i.primaryRequirement === null ? "pci-other" : `pci-${i.primaryRequirement}`,
      ref: i.ref,
      title: i.text,
      objective: i.text,
      implementationGuide: "",
      evidenceRequired: [],
      relatedPolicies: [],
      priority: "high",
    }));

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
