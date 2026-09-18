import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data/frameworks/soc2.ts");
const content = fs.readFileSync(filePath, "utf-8");

// The file got corrupted. Let me just rebuild it from scratch with the controls from before.
// Find the controls array - look for "  controls: [\n" and the matching close
const cStart = content.indexOf("  controls: [\n");
if (cStart === -1) throw new Error("controls array not found");

// Find the matching close - the array ends with "  ],\n  soc2Types: SOC2_TYPES,\n};" or similar
// Find the first occurrence of "  ]," after cStart
let searchEnd = cStart + 12;
let depth = 1;
let inString = false;
let stringChar = "";
let controlsEnd = -1;
let i = searchEnd;
while (i < content.length) {
  const c = content[i];
  if (inString) {
    if (c === "\\") { i += 2; continue; }
    if (c === stringChar) inString = false;
  } else {
    if (c === '"' || c === "'" || c === "`") { inString = true; stringChar = c; }
    else if (c === "[") depth++;
    else if (c === "]") {
      depth--;
      if (depth === 0) { controlsEnd = i; break; }
    }
  }
  i++;
}
if (controlsEnd === -1) throw new Error("controls array end not found");

const controlsBlock = content.slice(cStart, controlsEnd + 1);
console.log("Extracted controls block length:", controlsBlock.length);

// Now write the full file from scratch
const newContent = `import { Framework, SOC2TypeInfo, SOC2Question } from "@/lib/types";

/**
 * SOC 2 Trust Services Criteria (TSC)
 * - Type I:  "Do you HAVE the control designed and in place?" (point-in-time design)
 * - Type II: "Is the control OPERATING EFFECTIVELY over a period?" (operating effectiveness)
 *
 * TSC Structure:
 * - Security (Common Criteria CC): 33 criteria (CC1.1-CC9.2) - MANDATORY
 * - Availability (A): 3 criteria (A1.1-A1.3) - OPTIONAL
 * - Confidentiality (C): 2 criteria (C1.1-C1.2) - OPTIONAL
 * - Processing Integrity (PI): 5 criteria (PI1.1-PI1.5) - OPTIONAL
 * - Privacy (P): 18 criteria (P1.1-P8.1) - OPTIONAL
 * Total: 61 TSC criteria
 */

// ===================================================================
// SOC 2 Type I vs Type II question sets
// Each criterion (CC1.1, A1.1, P6.3, etc.) has both a Type I and Type II question:
//   typeIQuestion  = "Do you HAVE the control designed and in place?"
//   typeIIQuestion = "Is the control OPERATING EFFECTIVELY over a period?"
// ===================================================================

const SOC2_TYPE_I_QUESTIONS: SOC2Question[] = [
  // CC1: Control Environment
  { ref: "CC1.1", text: "Commitment to integrity and ethical values", typeIQuestion: "Do you HAVE a documented code of conduct and ethics policy that demonstrates commitment to integrity?", typeIIQuestion: "Over the audit period, is the code of conduct consistently communicated, acknowledged, and enforced across the organization?", evidenceTypeI: ["Code of conduct policy", "Annual acknowledgment records"], evidenceTypeII: ["Acknowledgment logs (12 months)", "Disciplinary records", "Ethics training completion"] },
  { ref: "CC1.2", text: "Board of directors exercises oversight", typeIQuestion: "Do you HAVE a board (or equivalent) charter that defines oversight of internal controls and security?", typeIIQuestion: "Over the audit period, does the board actually review security reports and document oversight activities?", evidenceTypeI: ["Board charter", "Board member list"], evidenceTypeII: ["Quarterly board minutes", "Security reports to board"] },
  { ref: "CC1.3", text: "Management establishes structures, reporting lines, and authorities", typeIQuestion: "Do you HAVE a defined org chart and reporting structure for security responsibilities?", typeIIQuestion: "Over the audit period, are the defined structures actually in place and operating as designed?", evidenceTypeI: ["Org chart", "RACI matrix"], evidenceTypeII: ["Org chart version history", "Role descriptions"] },
  { ref: "CC1.4", text: "Commitment to competence", typeIQuestion: "Do you HAVE competency requirements and training plans for security roles?", typeIIQuestion: "Over the audit period, do personnel actually receive the required training and demonstrate competence?", evidenceTypeI: ["Job descriptions", "Training plan"], evidenceTypeII: ["Training completion records", "Performance reviews"] },
  { ref: "CC1.5", text: "Accountability for execution of responsibilities", typeIQuestion: "Do you HAVE performance metrics and accountability mechanisms for security responsibilities?", typeIIQuestion: "Over the audit period, are accountability mechanisms actually applied to individuals?", evidenceTypeI: ["KPI definitions", "Accountability policy"], evidenceTypeII: ["Performance review records", "Corrective action log"] },
  // CC2: Communication
  { ref: "CC2.1", text: "Information to support functioning of internal control", typeIQuestion: "Do you HAVE identified information sources and quality controls supporting security decisions?", typeIIQuestion: "Over the audit period, are the information sources actually used and the quality controls effective?", evidenceTypeI: ["Information requirements matrix"], evidenceTypeII: ["Sample of decisions using identified sources", "Data quality reports"] },
  { ref: "CC2.2", text: "Internal communication about internal controls", typeIQuestion: "Do you HAVE an internal communication plan for security responsibilities?", typeIIQuestion: "Over the audit period, are security communications actually delivered to relevant personnel?", evidenceTypeI: ["Communication plan", "Intranet page"], evidenceTypeII: ["Email distribution logs", "LMS completion records"] },
  { ref: "CC2.3", text: "External communication about internal controls", typeIQuestion: "Do you HAVE a public trust page or external communication channel for security?", typeIIQuestion: "Over the audit period, are customer security inquiries actually addressed in a timely manner?", evidenceTypeI: ["Trust center page", "Customer FAQ"], evidenceTypeII: ["Customer inquiry log", "Response time reports"] },
  // CC3: Risk Assessment
  { ref: "CC3.1", text: "Specification of suitable objectives", typeIQuestion: "Do you HAVE documented security objectives linked to business outcomes?", typeIIQuestion: "Over the audit period, are the objectives actually reviewed and updated by management?", evidenceTypeI: ["Objectives register"], evidenceTypeII: ["Management review minutes", "KPI reports"] },
  { ref: "CC3.2", text: "Identification and analysis of risk", typeIQuestion: "Do you HAVE an enterprise risk assessment methodology and risk register?", typeIIQuestion: "Over the audit period, are risks actually identified, analyzed, and tracked through the register?", evidenceTypeI: ["Risk methodology", "Risk register"], evidenceTypeII: ["Quarterly risk review minutes", "Risk owner attestations"] },
  { ref: "CC3.3", text: "Consideration of fraud risk", typeIQuestion: "Do you HAVE a fraud risk assessment as part of the enterprise risk process?", typeIIQuestion: "Over the audit period, is the fraud risk actually reviewed and anti-fraud controls tested?", evidenceTypeI: ["Fraud risk section of risk register"], evidenceTypeII: ["Fraud incident log", "Anti-fraud training records"] },
  { ref: "CC3.4", text: "Assessment of changes", typeIQuestion: "Do you HAVE a process to assess the impact of regulatory, operational, and technological changes?", typeIIQuestion: "Over the audit period, are changes actually assessed and documented for security impact?", evidenceTypeI: ["Change impact assessment template"], evidenceTypeII: ["Change register with impact assessments"] },
  // CC4: Monitoring
  { ref: "CC4.1", text: "Ongoing and separate evaluations", typeIQuestion: "Do you HAVE an internal audit / self-assessment program for security controls?", typeIIQuestion: "Over the audit period, are self-assessments and internal audits actually performed and documented?", evidenceTypeI: ["Internal audit charter", "Annual audit plan"], evidenceTypeII: ["Internal audit reports", "Self-assessment completion records"] },
  { ref: "CC4.2", text: "Evaluation of deficiencies and communication", typeIQuestion: "Do you HAVE a deficiency evaluation and escalation process?", typeIIQuestion: "Over the audit period, are deficiencies actually evaluated, escalated, and remediated?", evidenceTypeI: ["Deficiency tracking template"], evidenceTypeII: ["Deficiency log", "Escalation records", "Remediation closure records"] },
  // CC5: Control Activities
  { ref: "CC5.1", text: "Selection and development of control activities", typeIQuestion: "Do you HAVE a control-to-risk mapping that documents selected control activities?", typeIIQuestion: "Over the audit period, are the selected control activities actually in place and effective?", evidenceTypeI: ["Control matrix"], evidenceTypeII: ["Control testing results", "Evidence of control operation"] },
  { ref: "CC5.2", text: "Technology-based control activities", typeIQuestion: "Do you HAVE automated/technology-based controls (e.g., policy-as-code) for security?", typeIIQuestion: "Over the audit period, are the technology-based controls actually executing as intended?", evidenceTypeI: ["Automation inventory", "Configuration snapshots"], evidenceTypeII: ["Automated control run logs", "Coverage reports"] },
  { ref: "CC5.3", text: "Deployment of controls through policies and procedures", typeIQuestion: "Do you HAVE a documented policy library and approval workflow?", typeIIQuestion: "Over the audit period, are policies actually reviewed annually and disseminated to staff?", evidenceTypeI: ["Policy library", "Approval workflow"], evidenceTypeII: ["Policy review logs", "Acknowledgment records"] },
  // CC6: Access
  { ref: "CC6.1", text: "Logical access security measures", typeIQuestion: "Do you HAVE logical access controls (RBAC, MFA, access reviews)?", typeIIQuestion: "Over the audit period, are logical access controls actually operating effectively?", evidenceTypeI: ["Access control policy", "MFA configuration"], evidenceTypeII: ["Quarterly access review records", "MFA enforcement reports"] },
  { ref: "CC6.2", text: "Prior to issuing credentials, users are registered and authorized", typeIQuestion: "Do you HAVE an account provisioning workflow with documented approval?", typeIIQuestion: "Over the audit period, is account provisioning actually performed only with documented approval?", evidenceTypeI: ["Provisioning workflow", "Approval form template"], evidenceTypeII: ["Provisioning tickets with approvals"] },
  { ref: "CC6.3", text: "Access is removed when no longer required", typeIQuestion: "Do you HAVE a deprovisioning process tied to HR termination events?", typeIIQuestion: "Over the audit period, is access actually removed promptly upon termination or role change?", evidenceTypeI: ["Deprovisioning policy"], evidenceTypeII: ["Deprovisioning logs", "Time-to-deprovision KPI"] },
  { ref: "CC6.4", text: "Restrict physical access", typeIQuestion: "Do you HAVE physical access controls (badges, visitor logs, CCTV)?", typeIIQuestion: "Over the audit period, are physical access controls actually preventing unauthorized entry?", evidenceTypeI: ["Physical security policy", "CCTV coverage map"], evidenceTypeII: ["Badge access logs", "CCTV review records"] },
  { ref: "CC6.5", text: "Discontinue logical and physical protection", typeIQuestion: "Do you HAVE a system decommissioning procedure that includes access removal?", typeIIQuestion: "Over the audit period, are systems actually decommissioned with access removed and assets sanitized?", evidenceTypeI: ["Decommission checklist"], evidenceTypeII: ["Decommission records", "Sanitization evidence"] },
  { ref: "CC6.6", text: "Implement boundary protection", typeIQuestion: "Do you HAVE boundary protection controls (firewalls, WAF, segmentation)?", typeIIQuestion: "Over the audit period, are boundary protection controls actually preventing unauthorized access?", evidenceTypeI: ["Network diagram", "Firewall rule review"], evidenceTypeII: ["Firewall change log", "IDS/IPS alerts", "Penetration test results"] },
  { ref: "CC6.7", text: "Restriction of data transmission and removal", typeIQuestion: "Do you HAVE DLP and removable media controls?", typeIIQuestion: "Over the audit period, are DLP and media controls actually preventing unauthorized data movement?", evidenceTypeI: ["DLP policy", "Removable media policy"], evidenceTypeII: ["DLP alert logs", "USB device control logs"] },
  { ref: "CC6.8", text: "Prevent and detect unauthorized software", typeIQuestion: "Do you HAVE EDR/anti-malware deployed to all in-scope endpoints?", typeIIQuestion: "Over the audit period, does EDR actually detect and prevent malware effectively?", evidenceTypeI: ["EDR deployment report", "Anti-malware policy"], evidenceTypeII: ["EDR detection logs", "Malware incident records"] },
  // CC7: System Operations
  { ref: "CC7.1", text: "Detection of new vulnerabilities and changes", typeIQuestion: "Do you HAVE vulnerability scanning and configuration monitoring processes?", typeIIQuestion: "Over the audit period, are vulnerabilities actually detected and remediated within SLAs?", evidenceTypeI: ["Vuln scan policy", "Tool configuration"], evidenceTypeII: ["Scan reports", "Remediation tickets", "SLA compliance reports"] },
  { ref: "CC7.2", text: "Monitor system components for anomalies", typeIQuestion: "Do you HAVE a SIEM or equivalent monitoring solution?", typeIIQuestion: "Over the audit period, is the SIEM actually detecting anomalies and triggering alerts?", evidenceTypeI: ["SIEM architecture doc"], evidenceTypeII: ["SIEM dashboards", "Detection coverage metrics", "Daily review logs"] },
  { ref: "CC7.3", text: "Evaluate and communicate security events", typeIQuestion: "Do you HAVE an incident response plan with severity classification?", typeIIQuestion: "Over the audit period, are security events actually evaluated and communicated per the IR plan?", evidenceTypeI: ["IR plan", "Severity matrix"], evidenceTypeII: ["Incident tickets with severity", "Communication records"] },
  { ref: "CC7.4", text: "Respond to identified security incidents", typeIQuestion: "Do you HAVE documented IR procedures and on-call rotation?", typeIIQuestion: "Over the audit period, are incidents actually responded to within defined SLAs?", evidenceTypeI: ["IR runbooks", "On-call schedule"], evidenceTypeII: ["MTTD/MTTR metrics", "Post-incident reports"] },
  { ref: "CC7.5", text: "Recovery from identified security incidents", typeIQuestion: "Do you HAVE recovery and restoration procedures?", typeIIQuestion: "Over the audit period, are recovery procedures actually executed and validated after incidents?", evidenceTypeI: ["Recovery procedures"], evidenceTypeII: ["Recovery test reports", "Lessons learned"] },
  // CC8: Change Management
  { ref: "CC8.1", text: "Authorize, design, develop, configure, and document changes", typeIQuestion: "Do you HAVE a change management process with approvals?", typeIIQuestion: "Over the audit period, are changes actually approved, documented, and rolled back when needed?", evidenceTypeI: ["Change management policy"], evidenceTypeII: ["Change tickets", "Approval records", "Rollback evidence"] },
  { ref: "CC8.2", text: "Test and approve changes before implementation", typeIQuestion: "Do you HAVE testing and UAT requirements before production changes?", typeIIQuestion: "Over the audit period, are changes actually tested and signed off before deployment?", evidenceTypeI: ["Test plan template"], evidenceTypeII: ["Test reports", "UAT sign-offs", "Production deploy logs"] },
  // CC9: Risk Mitigation
  { ref: "CC9.1", text: "Identify, select, and develop risk mitigation activities", typeIQuestion: "Do you HAVE a BC/DR plan with documented RTOs and RPOs?", typeIIQuestion: "Over the audit period, is the BC/DR plan actually tested and gaps remediated?", evidenceTypeI: ["BC/DR plan"], evidenceTypeII: ["DR test reports", "Remediation action items"] },
  { ref: "CC9.2", text: "Vendor and business partner risk assessment", typeIQuestion: "Do you HAVE a vendor risk management program?", typeIIQuestion: "Over the audit period, are vendors actually assessed, monitored, and contractually bound?", evidenceTypeI: ["Vendor risk policy"], evidenceTypeII: ["Vendor risk assessments", "Contract security clauses", "Annual review records"] },
  // Availability
  { ref: "A1.1", text: "Maintain and monitor availability commitments", typeIQuestion: "Do you HAVE availability SLAs and monitoring?", typeIIQuestion: "Over the audit period, are availability SLAs actually met and breaches investigated?", evidenceTypeI: ["SLA definitions"], evidenceTypeII: ["Uptime reports", "Breach investigation records"] },
  { ref: "A1.2", text: "Environmental protections and recovery infrastructure", typeIQuestion: "Do you HAVE redundancy, backups, and environmental controls?", typeIIQuestion: "Over the audit period, do redundancy and recovery infrastructure actually work when tested?", evidenceTypeI: ["Architecture docs"], evidenceTypeII: ["Backup logs", "Failover test results"] },
  { ref: "A1.3", text: "Test recovery plan procedures", typeIQuestion: "Do you HAVE annual DR testing requirements?", typeIIQuestion: "Over the audit period, is DR actually tested annually with documented results?", evidenceTypeI: ["DR test plan"], evidenceTypeII: ["DR test reports", "Remediation actions"] },
  // Confidentiality
  { ref: "C1.1", text: "Identify and protect confidential information", typeIQuestion: "Do you HAVE a data classification scheme and handling controls?", typeIIQuestion: "Over the audit period, is confidential information actually classified and protected per the scheme?", evidenceTypeI: ["Classification policy"], evidenceTypeII: ["Asset inventory with classifications", "Handling logs"] },
  { ref: "C1.2", text: "Dispose of, retain, and protect confidential information", typeIQuestion: "Do you HAVE retention and secure disposal procedures?", typeIIQuestion: "Over the audit period, is confidential information actually disposed of per retention schedule?", evidenceTypeI: ["Retention policy"], evidenceTypeII: ["Disposal logs", "Retention compliance reports"] },
  // Processing Integrity
  { ref: "PI1.1", text: "Processing integrity of inputs and outputs", typeIQuestion: "Do you HAVE input validation and reconciliation controls?", typeIIQuestion: "Over the audit period, are inputs/outputs actually validated and reconciled?", evidenceTypeI: ["Validation rules"], evidenceTypeII: ["Reconciliation reports", "Error logs"] },
  { ref: "PI1.2", text: "System processing is complete, accurate, timely, and authorized", typeIQuestion: "Do you HAVE processing SLAs and authorization controls?", typeIIQuestion: "Over the audit period, is processing actually complete, accurate, and timely?", evidenceTypeI: ["Processing rules"], evidenceTypeII: ["Processing logs", "Quality metrics"] },
  { ref: "PI1.3", text: "Store inputs and outputs accurately", typeIQuestion: "Do you HAVE integrity verification (checksums, hashing) for stored data?", typeIIQuestion: "Over the audit period, is stored data actually verified for integrity?", evidenceTypeI: ["Integrity check procedures"], evidenceTypeII: ["Integrity scan reports"] },
  { ref: "PI1.4", text: "Implement policies and procedures over system inputs and outputs", typeIQuestion: "Do you HAVE documented SOPs for input/output handling?", typeIIQuestion: "Over the audit period, are the SOPs actually followed by personnel?", evidenceTypeI: ["Processing SOPs"], evidenceTypeII: ["SOP training records", "Compliance audit results"] },
  { ref: "PI1.5", text: "Detect and mitigate processing errors", typeIQuestion: "Do you HAVE error detection and exception workflows?", typeIIQuestion: "Over the audit period, are processing errors actually detected and remediated within SLAs?", evidenceTypeI: ["Error monitoring plan"], evidenceTypeII: ["Error tickets", "MTTR metrics"] },
  // Privacy
  { ref: "P1.1", text: "Provide notice to data subjects", typeIQuestion: "Do you HAVE a published privacy notice?", typeIIQuestion: "Over the audit period, is the privacy notice actually available at all collection points?", evidenceTypeI: ["Privacy notice"], evidenceTypeII: ["Web analytics", "Collection point surveys"] },
  { ref: "P2.1", text: "Identify choices and obtain consent", typeIQuestion: "Do you HAVE consent capture and opt-out mechanisms?", typeIIQuestion: "Over the audit period, is consent actually captured and respected across systems?", evidenceTypeI: ["Consent management design"], evidenceTypeII: ["Consent records", "Opt-out logs"] },
  { ref: "P3.1", text: "Collect personal information consistent with objectives", typeIQuestion: "Do you HAVE a data inventory mapped to collection purposes?", typeIIQuestion: "Over the audit period, is personal information actually collected only per documented purposes?", evidenceTypeI: ["Data inventory"], evidenceTypeII: ["Collection audit results"] },
  { ref: "P3.2", text: "Explicitly define purposes for collection", typeIQuestion: "Do you HAVE a privacy impact assessment process?", typeIIQuestion: "Over the audit period, are PIAs actually completed for new collections?", evidenceTypeI: ["PIA template"], evidenceTypeII: ["Completed PIAs", "DPO sign-offs"] },
  { ref: "P4.1", text: "Limit personal information use, retention, and disclosure", typeIQuestion: "Do you HAVE retention and use-limitation controls?", typeIIQuestion: "Over the audit period, is personal information actually used only for stated purposes?", evidenceTypeI: ["Retention schedule"], evidenceTypeII: ["Purge job logs", "Use-limitation reports"] },
  { ref: "P4.2", text: "Retain personal information per objectives", typeIQuestion: "Do you HAVE automated retention enforcement?", typeIIQuestion: "Over the audit period, is personal information actually retained per the schedule?", evidenceTypeI: ["Retention policy"], evidenceTypeII: ["Retention compliance reports"] },
  { ref: "P4.3", text: "Delete or de-identify personal information when no longer needed", typeIQuestion: "Do you HAVE secure deletion procedures?", typeIIQuestion: "Over the audit period, is personal information actually deleted/de-identified at end of life?", evidenceTypeI: ["Deletion procedures"], evidenceTypeII: ["Deletion logs", "Proof of deletion"] },
  { ref: "P5.1", text: "Identify and protect personal information", typeIQuestion: "Do you HAVE encryption and access controls for personal data?", typeIIQuestion: "Over the audit period, is personal data actually protected by the controls?", evidenceTypeI: ["Encryption configuration"], evidenceTypeII: ["Encryption scan results", "Access review records"] },
  { ref: "P5.2", text: "Identify and protect personal information during transmission", typeIQuestion: "Do you HAVE TLS and certificate management?", typeIIQuestion: "Over the audit period, is personal data in transit actually protected?", evidenceTypeI: ["TLS configuration"], evidenceTypeII: ["Certificate monitoring logs", "TLS scan reports"] },
  { ref: "P6.1", text: "Provide access to personal information to data subjects", typeIQuestion: "Do you HAVE a DSAR fulfillment workflow?", typeIIQuestion: "Over the audit period, are DSARs actually fulfilled within statutory timelines?", evidenceTypeI: ["DSAR workflow"], evidenceTypeII: ["DSAR tickets with completion dates"] },
  { ref: "P6.2", text: "Provide correction of personal information", typeIQuestion: "Do you HAVE a correction workflow for data subjects?", typeIIQuestion: "Over the audit period, are correction requests actually processed and propagated?", evidenceTypeI: ["Correction procedure"], evidenceTypeII: ["Correction tickets"] },
  { ref: "P6.3", text: "Provide deletion of personal information", typeIQuestion: "Do you HAVE a deletion workflow covering all data stores?", typeIIQuestion: "Over the audit period, are deletion requests actually completed across all systems?", evidenceTypeI: ["Deletion pipeline design"], evidenceTypeII: ["Deletion completion records"] },
  { ref: "P6.4", text: "Provide data portability", typeIQuestion: "Do you HAVE machine-readable export functionality?", typeIIQuestion: "Over the audit period, are portability requests actually fulfilled?", evidenceTypeI: ["Export feature documentation"], evidenceTypeII: ["Export request logs"] },
  { ref: "P6.5", text: "Inform data subjects of disclosures and process for complaints", typeIQuestion: "Do you HAVE published privacy contact and complaint process?", typeIIQuestion: "Over the audit period, are complaints actually received and acknowledged?", evidenceTypeI: ["Complaint process"], evidenceTypeII: ["Complaint intake logs"] },
  { ref: "P6.6", text: "Provide for remediation", typeIQuestion: "Do you HAVE a remediation workflow for privacy complaints?", typeIIQuestion: "Over the audit period, are complaints actually resolved within timelines?", evidenceTypeI: ["Remediation workflow"], evidenceTypeII: ["Resolution records", "SLA reports"] },
  { ref: "P6.7", text: "Implement a process to handle privacy complaints", typeIQuestion: "Do you HAVE a documented privacy complaint program?", typeIIQuestion: "Over the audit period, is the complaint program actually operational?", evidenceTypeI: ["Privacy complaint program"], evidenceTypeII: ["Program operating metrics"] },
  { ref: "P7.1", text: "Communicate to data subjects about quality of personal information", typeIQuestion: "Do you HAVE documented data quality commitments?", typeIIQuestion: "Over the audit period, are quality commitments actually communicated?", evidenceTypeI: ["Quality commitments"], evidenceTypeII: ["Communication records"] },
  { ref: "P8.1", text: "Establish a process for receiving, investigating, and resolving complaints", typeIQuestion: "Do you HAVE an end-to-end complaint resolution process?", typeIIQuestion: "Over the audit period, are complaints actually investigated and resolved with documentation?", evidenceTypeI: ["Complaint resolution process"], evidenceTypeII: ["Investigation records", "Resolution outcomes"] },
];

const SOC2_TYPES: SOC2TypeInfo[] = [
  {
    type: "I",
    name: "SOC 2 Type I",
    scope: "Mandatory",
    aicpaCriteriaCount: "61 TSC criteria (CC1.1-P8.1)",
    description: "Report on management's description of the system and the suitability of the design of controls at a point in time. Auditor opines on whether controls are designed appropriately.",
    targetAudience: "Customers and prospects who need assurance that controls are designed correctly at a specific point in time. Faster to obtain (typically 3-6 months).",
    questions: SOC2_TYPE_I_QUESTIONS,
  },
  {
    type: "II",
    name: "SOC 2 Type II",
    scope: "Mandatory",
    aicpaCriteriaCount: "61 TSC criteria (CC1.1-P8.1)",
    description: "Report on management's description of the system AND the operating effectiveness of controls over a period of time (typically 6-12 months). Auditor opines on whether controls both are designed appropriately AND operated effectively throughout the period.",
    targetAudience: "Customers and prospects who need assurance that controls not only exist but actually work as designed over time. Higher level of assurance; standard expectation for most enterprise customers.",
    questions: SOC2_TYPE_I_QUESTIONS, // Same criteria — distinction is design vs operating effectiveness
  },
];

export const soc2: Framework = {
  id: "soc2",
  name: "SOC 2 (Trust Services Criteria)",
  shortName: "SOC 2",
  version: "TSC 2017 (rev. 2022)",
  description: "AICPA Trust Services Criteria evaluating controls over security, availability, processing integrity, confidentiality, and privacy. Type I assesses design at a point in time; Type II assesses operating effectiveness over a period.",
  color: "#0EA5E9",
  domains: [
    { id: "soc2-cc1", name: "CC1 — Control Environment", description: "Integrity, ethical values, and governance oversight." },
    { id: "soc2-cc2", name: "CC2 — Communication & Information", description: "Internal/external communication of security responsibilities." },
    { id: "soc2-cc3", name: "CC3 — Risk Assessment", description: "Risk identification, analysis, and management." },
    { id: "soc2-cc4", name: "CC4 — Monitoring Activities", description: "Ongoing and separate evaluations of controls." },
    { id: "soc2-cc5", name: "CC5 — Control Activities", description: "Selection and development of control activities." },
    { id: "soc2-cc6", name: "CC6 — Logical & Physical Access", description: "Access provisioning, authentication, and physical security." },
    { id: "soc2-cc7", name: "CC7 — System Operations", description: "Detection, monitoring, and incident response." },
    { id: "soc2-cc8", name: "CC8 — Change Management", description: "Authorization and management of system changes." },
    { id: "soc2-cc9", name: "CC9 — Risk Mitigation", description: "Business disruption and vendor risk mitigation." },
    { id: "soc2-a", name: "Availability (A)", description: "Optional — system availability commitments and recovery." },
    { id: "soc2-c", name: "Confidentiality (C)", description: "Optional — protection of confidential information." },
    { id: "soc2-pi", name: "Processing Integrity (PI)", description: "Optional — completeness, accuracy, and timeliness." },
    { id: "soc2-p", name: "Privacy (P)", description: "Optional — personal information handling and rights." },
  ],
  controls: [
${controlsBlock.split("\n").slice(1, -1).join("\n")}
  ],
  soc2Types: SOC2_TYPES,
};
`;

fs.writeFileSync(filePath, newContent);
console.log("Rebuilt soc2.ts");
console.log("Total lines:", newContent.split("\n").length);