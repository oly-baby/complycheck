export type ControlStatus = "covered" | "partial" | "gap" | "na" | "unmarked";

export type FrameworkId =
  | "iso27001"
  | "nistCsf"
  | "soc2"
  | "pciDss"
  | "gdpr"
  | "nist80053"
  | "hipaa"
  | "dora"
  | "ndpa"
  | "cis";

export interface Control {
  id: string;
  domainId: string;
  ref: string; // e.g. "A.5.1", "PR.AC-01", "CC6.1"
  title: string;
  objective: string;
  implementationGuide: string;
  evidenceRequired: string[];
  relatedPolicies: string[]; // policy ids
  essential?: boolean; // "Audit Essentials" toggle
  remediationStrategy?: string; // Suggested remediation path for gap/partial
  priority?: "low" | "medium" | "high" | "critical";
  socType?: "I" | "II" | "both"; // For SOC 2 controls
  saqType?: SAQType; // For PCI DSS controls
}

export type SAQType =
  | "A"
  | "A-EP"
  | "B"
  | "B-IP"
  | "C-VT"
  | "C"
  | "P2PE"
  | "D-Merchant"
  | "D-ServiceProvider"
  | "SPoC";

export interface Domain {
  id: string;
  name: string;
  description: string;
}

export interface Framework {
  id: FrameworkId;
  name: string;
  shortName: string;
  version: string;
  description: string;
  color: string; // accent hex for this framework's badge
  domains: Domain[];
  controls: Control[];
  saqTypes?: SAQTypeInfo[]; // Only for PCI-DSS
  soc2Types?: SOC2TypeInfo[]; // Only for SOC 2
}

export interface SAQTypeInfo {
  type: SAQType;
  name: string;
  description: string;
  targetEnvironment: string;
  approxQuestions: string;
  questions: SAQQuestion[];
}

export interface SAQQuestion {
  ref: string; // e.g., "A.1", "A-EP.2", "B.3"
  text: string;
  pciRequirement?: string; // Underlying PCI-DSS requirement
}

export type SOC2Type = "I" | "II";

export interface SOC2Question {
  ref: string; // e.g., "CC1.1", "CC6.1"
  text: string;
  typeIQuestion: string; // "Do you HAVE the control designed and in place?"
  typeIIQuestion: string; // "Is the control OPERATING EFFECTIVELY over a period?"
  evidenceTypeI: string[]; // Evidence required for design assertion (Type I)
  evidenceTypeII: string[]; // Evidence required for operating effectiveness (Type II)
}

export interface SOC2TypeInfo {
  type: SOC2Type;
  name: string;
  scope: "Mandatory" | "Optional";
  aicpaCriteriaCount: string;
  description: string;
  targetAudience: string;
  questions: SOC2Question[];
}



export interface Policy {
  id: string;
  name: string;
  description: string;
  required: boolean;
  appliesTo: FrameworkId[];
}

export interface ControlAssessment {
  controlId: string;
  status: ControlStatus;
  notes?: string;
  evidenceTags?: string[];
  updatedAt?: string;
}

export interface PolicyAssessment {
  policyId: string;
  status: ControlStatus;
  notes?: string;
}

export interface AssessmentMeta {
  companyName: string;
  assessorRole: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentState {
  meta: AssessmentMeta;
  activeFramework: FrameworkId | "policies" | null;
  controlAssessments: Record<string, ControlAssessment>; // key: controlId
  policyAssessments: Record<string, PolicyAssessment>; // key: policyId
}

export interface DomainScore {
  domainId: string;
  domainName: string;
  total: number;
  covered: number;
  partial: number;
  gap: number;
  na: number;
  unreadiness: number;
  readinessPct: number;
  gapPct: number;
}

export interface FrameworkScore {
  frameworkId: FrameworkId;
  total: number;
  covered: number;
  partial: number;
  gap: number;
  na: number;
  unmarked: number;
  readinessPct: number;
  gapPct: number;
  domainScores: DomainScore[];
  riskLevel: "Low" | "Moderate" | "High" | "Critical";
  topGaps: Control[];
}

export const STATUS_LABEL: Record<ControlStatus, string> = {
  covered: "Covered",
  partial: "Partial",
  gap: "Gap",
  na: "N/A",
  unmarked: "Unmarked",
};

export const STATUS_DESCRIPTION: Record<ControlStatus, string> = {
  covered: "Control is fully implemented, documented, and operating effectively with evidence.",
  partial: "Control is partially in place but has gaps in implementation, documentation, or effectiveness.",
  gap: "Control is missing or not implemented; requires remediation.",
  na: "Control is not applicable to the organization's environment.",
  unmarked: "Control has not yet been assessed.",
};
