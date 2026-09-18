import { AssessmentState, ControlAssessment } from "@/lib/types";

const covered = [
  "iso-5.1",
  "iso-5.2",
  "iso-5.9",
  "iso-5.15",
  "iso-5.24",
  "iso-6.3",
  "iso-6.5",
  "iso-7.2",
  "iso-8.1",
  "iso-8.2",
  "iso-8.5",
  "iso-8.16",
  "iso-8.24",
];

const partial = ["iso-5.7", "iso-5.30", "iso-6.1", "iso-6.6", "iso-7.1", "iso-8.9", "iso-8.20"];

const gap = ["iso-5.23", "iso-7.7", "iso-7.9", "iso-8.8", "iso-8.12", "iso-8.28"];

function buildAssessments(): Record<string, ControlAssessment> {
  const out: Record<string, ControlAssessment> = {};
  const now = new Date().toISOString();
  for (const id of covered) out[id] = { controlId: id, status: "covered", updatedAt: now };
  for (const id of partial)
    out[id] = {
      controlId: id,
      status: "partial",
      notes: "In progress — remediation planned for next quarter.",
      updatedAt: now,
    };
  for (const id of gap)
    out[id] = {
      controlId: id,
      status: "gap",
      notes: "Not yet implemented — flagged as a priority gap.",
      updatedAt: now,
    };
  return out;
}

export function getDemoState(): AssessmentState {
  const now = new Date().toISOString();
  return {
    meta: {
      companyName: "Acme Cyber Corp",
      assessorRole: "Lead Security Architect",
      createdAt: now,
      updatedAt: now,
    },
    activeFramework: "iso27001",
    controlAssessments: buildAssessments(),
    policyAssessments: {},
  };
}
