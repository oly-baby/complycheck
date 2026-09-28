import {
  ControlAssessment,
  ControlStatus,
  Framework,
  MerchantLevel,
  MerchantLevelTypeInfo,
} from "./types";

/**
 * PCI-DSS is assessed through merchant level questionnaires rather than the
 * generic control checklist. Answers are stored in the shared assessments map
 * under a synthetic key so that they survive alongside control answers; the key
 * format is persisted, so it must not change.
 */
export const MERCHANT_LEVEL_ANSWER_PREFIX = "merchantLevel";

export function merchantLevelAnswerId(level: MerchantLevel, ref: string): string {
  return `${MERCHANT_LEVEL_ANSWER_PREFIX}-${level}-${ref}`;
}

export interface MerchantLevelItem {
  id: string;
  ref: string;
  text: string;
  pciRequirement: string;
  /** First PCI DSS requirement number a question maps to, e.g. "12.8, 12.9" -> 12. */
  primaryRequirement: number | null;
  status: ControlStatus;
}

export function getMerchantLevelInfo(
  framework: Framework,
  level: MerchantLevel | null | undefined
): MerchantLevelTypeInfo | undefined {
  if (framework.id !== "pciDss" || !level) return undefined;
  return framework.merchantLevels?.find((l) => l.level === level);
}

export function primaryRequirementNumber(pciRequirement?: string): number | null {
  const match = pciRequirement?.match(/\d+/);
  return match ? Number.parseInt(match[0], 10) : null;
}

export function statusOfAnswer(
  assessments: Record<string, ControlAssessment>,
  id: string
): ControlStatus {
  return assessments[id]?.status ?? "unmarked";
}

export function merchantLevelItems(
  framework: Framework,
  level: MerchantLevel | null | undefined,
  assessments: Record<string, ControlAssessment>
): MerchantLevelItem[] {
  const info = getMerchantLevelInfo(framework, level);
  if (!info) return [];
  return info.questions.map((q) => {
    const id = merchantLevelAnswerId(info.level, q.ref);
    return {
      id,
      ref: q.ref,
      text: q.text,
      pciRequirement: q.pciRequirement ?? "—",
      primaryRequirement: primaryRequirementNumber(q.pciRequirement),
      status: statusOfAnswer(assessments, id),
    };
  });
}
