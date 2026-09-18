import { Framework, FrameworkId } from "@/lib/types";
import { iso27001 } from "./iso27001";
import { nistCsf } from "./nistCsf";
import { soc2 } from "./soc2";
import { pciDss } from "./pciDss";
import { gdpr } from "./gdpr";
import { nist80053 } from "./nist80053";
import { hipaa } from "./hipaa";
import { dora } from "./dora";
import { ndpa } from "./ndpa";
import { cis } from "./cis";

export const frameworks: Framework[] = [
  iso27001,
  nistCsf,
  soc2,
  pciDss,
  gdpr,
  nist80053,
  hipaa,
  dora,
  ndpa,
  cis,
];

export const frameworksById: Record<FrameworkId, Framework> = {
  iso27001,
  nistCsf,
  soc2,
  pciDss,
  gdpr,
  nist80053,
  hipaa,
  dora,
  ndpa,
  cis,
};

export function getFramework(id: FrameworkId): Framework {
  return frameworksById[id];
}
