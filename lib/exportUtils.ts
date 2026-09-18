import { AssessmentState, Framework, STATUS_LABEL } from "./types";

function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function csvEscape(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportFrameworkCsv(framework: Framework, state: AssessmentState) {
  const header = ["Domain", "Ref", "Control", "Status", "Notes"];
  const rows = framework.controls.map((c) => {
    const a = state.controlAssessments[c.id];
    const domain = framework.domains.find((d) => d.id === c.domainId);
    return [
      domain?.name ?? "",
      c.ref,
      c.title,
      STATUS_LABEL[a?.status ?? "unmarked"],
      a?.notes ?? "",
    ]
      .map(csvEscape)
      .join(",");
  });
  const csv = [header.join(","), ...rows].join("\n");
  downloadBlob(csv, `${framework.shortName.replace(/\s+/g, "_")}_assessment.csv`, "text/csv");
}

export function exportFrameworkJson(framework: Framework, state: AssessmentState) {
  const payload = {
    framework: framework.name,
    company: state.meta.companyName,
    role: state.meta.assessorRole,
    exportedAt: new Date().toISOString(),
    controls: framework.controls.map((c) => ({
      ref: c.ref,
      title: c.title,
      domain: framework.domains.find((d) => d.id === c.domainId)?.name,
      status: state.controlAssessments[c.id]?.status ?? "unmarked",
      notes: state.controlAssessments[c.id]?.notes ?? "",
    })),
  };
  downloadBlob(
    JSON.stringify(payload, null, 2),
    `${framework.shortName.replace(/\s+/g, "_")}_assessment.json`,
    "application/json"
  );
}
