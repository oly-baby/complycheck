import { AssessmentState, Framework, STATUS_LABEL } from "./types";
import { getMerchantLevelInfo, merchantLevelItems } from "./merchantLevels";

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

function merchantLevelSummary(framework: Framework, state: AssessmentState) {
  const level = getMerchantLevelInfo(framework, state.pciMerchantLevel);
  if (!level) return null;
  return {
    level: level.level,
    name: level.name,
    transactionVolumeRange: level.transactionVolumeRange,
    assessmentMethod: level.assessmentMethod,
  };
}

export function exportFrameworkCsv(framework: Framework, state: AssessmentState) {
  const level = merchantLevelSummary(framework, state);
  const filename = `${framework.shortName.replace(/\s+/g, "_")}_assessment.csv`;

  if (level) {
    // PCI-DSS exports the questionnaire of the assessed merchant level.
    const items = merchantLevelItems(framework, level.level, state.controlAssessments);
    const header = ["Merchant Level", "PCI Requirement", "Ref", "Question", "Status"];
    const rows = items.map((item) =>
      [level.name, item.pciRequirement, item.ref, item.text, STATUS_LABEL[item.status]]
        .map(csvEscape)
        .join(",")
    );
    downloadBlob([header.join(","), ...rows].join("\n"), filename, "text/csv");
    return;
  }

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
  downloadBlob([header.join(","), ...rows].join("\n"), filename, "text/csv");
}

export function exportFrameworkJson(framework: Framework, state: AssessmentState) {
  const filename = `${framework.shortName.replace(/\s+/g, "_")}_assessment.json`;
  const level = merchantLevelSummary(framework, state);

  if (level) {
    // PCI-DSS exports the questionnaire of the assessed merchant level.
    const items = merchantLevelItems(framework, level.level, state.controlAssessments);
    const payload = {
      framework: framework.name,
      frameworkVersion: framework.version,
      company: state.meta.companyName,
      role: state.meta.assessorRole,
      merchantLevel: level,
      exportedAt: new Date().toISOString(),
      questions: items.map((item) => ({
        ref: item.ref,
        pciRequirement: item.pciRequirement,
        question: item.text,
        status: item.status,
      })),
    };
    downloadBlob(JSON.stringify(payload, null, 2), filename, "application/json");
    return;
  }

  const payload = {
    framework: framework.name,
    company: state.meta.companyName,
    role: state.meta.assessorRole,
    merchantLevel: null,
    exportedAt: new Date().toISOString(),
    controls: framework.controls.map((c) => ({
      ref: c.ref,
      title: c.title,
      domain: framework.domains.find((d) => d.id === c.domainId)?.name,
      status: state.controlAssessments[c.id]?.status ?? "unmarked",
      notes: state.controlAssessments[c.id]?.notes ?? "",
    })),
  };
  downloadBlob(JSON.stringify(payload, null, 2), filename, "application/json");
}
