import { Framework } from "@/lib/types";

/**
 * NIST SP 800-53 Rev. 5 — 20 Control Families
 * - AC: Access Control
 * - AT: Awareness and Training
 * - AU: Audit and Accountability
 * - CA: Assessment, Authorization, & Monitoring
 * - CM: Configuration Management
 * - CP: Contingency Planning
 * - IA: Identification and Authentication
 * - IR: Incident Response
 * - MA: Maintenance
 * - MP: Media Protection
 * - PE: Physical and Environmental Protection
 * - PL: Planning
 * - PS: Personnel Security
 * - PT: PII Processing and Transparency (Privacy)
 * - RA: Risk Assessment
 * - SA: System and Services Acquisition
 * - SC: System and Communications Protection
 * - SI: System and Information Integrity
 * - SR: Supply Chain Risk Management
 * - PM: Program Management (organization-wide)
 */
export const nist80053: Framework = {
  id: "nist80053",
  name: "NIST SP 800-53 Rev. 5",
  shortName: "NIST 800-53",
  version: "Rev 5",
  description:
    "Catalog of security and privacy controls for federal information systems, organized into 20 control families (AC, AT, AU, CA, CM, CP, IA, IR, MA, MP, PE, PL, PS, PT, RA, SA, SC, SI, SR, PM).",
  color: "#3B82F6",
  domains: [
    { id: "800-ac", name: "Access Control (AC)", description: "User identity verification, privilege management, remote access, least privilege." },
    { id: "800-at", name: "Awareness and Training (AT)", description: "Security awareness training, role training, simulated phishing." },
    { id: "800-au", name: "Audit and Accountability (AU)", description: "Log generation, log review, SIEM monitoring, time sync." },
    { id: "800-ca", name: "Assessment, Authorization, & Monitoring (CA)", description: "Security assessments, continuous monitoring, POA&M management." },
    { id: "800-cm", name: "Configuration Management (CM)", description: "Baseline configurations, change control, inventory." },
    { id: "800-cp", name: "Contingency Planning (CP)", description: "Disaster recovery, system backups, business continuity testing." },
    { id: "800-ia", name: "Identification and Authentication (IA)", description: "MFA, password policies, certificate management." },
    { id: "800-ir", name: "Incident Response (IR)", description: "IR plans, breach detection, reporting, forensics." },
    { id: "800-ma", name: "Maintenance (MA)", description: "System maintenance controls, remote maintenance, equipment sanitization." },
    { id: "800-mp", name: "Media Protection (MP)", description: "Sanitization, encryption, physical transport of removable media." },
    { id: "800-pe", name: "Physical and Environmental Protection (PE)", description: "Visitor logs, datacenter security, power/HVAC." },
    { id: "800-pl", name: "Planning (PL)", description: "System Security Plans (SSP), privacy architecture, rules of behavior." },
    { id: "800-ps", name: "Personnel Security (PS)", description: "Background checks, termination, third-party screening." },
    { id: "800-pt", name: "PII Processing and Transparency (PT)", description: "Privacy notices, data collection consent." },
    { id: "800-ra", name: "Risk Assessment (RA)", description: "Vulnerability scanning, risk management framework, threat modeling." },
    { id: "800-sa", name: "System and Services Acquisition (SA)", description: "Supply chain risk, SDLC, system documentation." },
    { id: "800-sc", name: "System and Communications Protection (SC)", description: "Boundary defense, encryption in transit (TLS), segmentation." },
    { id: "800-si", name: "System and Information Integrity (SI)", description: "Patch management, anti-malware, flaw remediation, spam filtering." },
    { id: "800-sr", name: "Supply Chain Risk Management (SR)", description: "Vendor assessments, supply chain provenance, component authenticity." },
    { id: "800-pm", name: "Program Management (PM)", description: "Enterprise cybersecurity leadership, strategy, oversight." },
  ],
  controls: [
    // Access Control (AC)
    { id: "800-ac-2", domainId: "800-ac", ref: "AC-2", title: "Account Management", objective: "Manage system accounts through lifecycle.", implementationGuide: "Implement automated provisioning/deprovisioning.", evidenceRequired: ["Account management procedure", "Provisioning logs"], relatedPolicies: ["pol-access"], essential: true, priority: "high", remediationStrategy: "Implement IAM with automated lifecycle." },
    { id: "800-ac-5", domainId: "800-ac", ref: "AC-5", title: "Separation of Duties", objective: "Identify duties requiring separation.", implementationGuide: "Define SoD matrix and enforce.", evidenceRequired: ["SoD matrix"], relatedPolicies: ["pol-access"], priority: "high", remediationStrategy: "Document SoD; enforce via IAM constraints." },
    { id: "800-ac-6", domainId: "800-ac", ref: "AC-6", title: "Least Privilege", objective: "Employ least privilege.", implementationGuide: "Restrict privileges; periodic reviews.", evidenceRequired: ["Privilege review logs"], relatedPolicies: ["pol-access"], essential: true, priority: "high", remediationStrategy: "Restrict privileges; review quarterly." },
    { id: "800-ac-7", domainId: "800-ac", ref: "AC-7", title: "Unsuccessful Logon Attempts", objective: "Limit unsuccessful logon attempts.", implementationGuide: "Enforce account lockout policy.", evidenceRequired: ["Lockout policy"], relatedPolicies: ["pol-access"], priority: "medium", remediationStrategy: "Implement account lockout after failed attempts." },
    { id: "800-ac-17", domainId: "800-ac", ref: "AC-17", title: "Remote Access", objective: "Establish and document remote access policy.", implementationGuide: "Use VPN and MFA for remote access.", evidenceRequired: ["Remote access configuration"], relatedPolicies: ["pol-access", "pol-network"], priority: "high", remediationStrategy: "Implement VPN + MFA; monitor remote sessions." },

    // Awareness and Training (AT)
    { id: "800-at-2", domainId: "800-at", ref: "AT-2", title: "Literacy Training and Awareness", objective: "Provide security literacy training.", implementationGuide: "Provide annual security training.", evidenceRequired: ["Training records"], relatedPolicies: ["pol-training"], priority: "high", remediationStrategy: "Run annual security literacy training; track completion." },
    { id: "800-at-3", domainId: "800-at", ref: "AT-3", title: "Role-Based Training", objective: "Provide role-based training.", implementationGuide: "Tailor training for security roles.", evidenceRequired: ["Role-based training records"], relatedPolicies: ["pol-training"], priority: "medium", remediationStrategy: "Provide role-based training annually." },
    { id: "800-at-4", domainId: "800-at", ref: "AT-4", title: "Training Records", objective: "Document and monitor training.", implementationGuide: "Maintain training records.", evidenceRequired: ["Training records"], relatedPolicies: ["pol-training"], priority: "medium", remediationStrategy: "Maintain centralized training records." },

    // Audit and Accountability (AU)
    { id: "800-au-2", domainId: "800-au", ref: "AU-2", title: "Event Logging", objective: "Identify auditable events.", implementationGuide: "Define logging standard.", evidenceRequired: ["Logging standard"], relatedPolicies: ["pol-logging"], essential: true, priority: "high", remediationStrategy: "Document logging standard; implement across systems." },
    { id: "800-au-3", domainId: "800-au", ref: "AU-3", title: "Content of Audit Records", objective: "Generate audit records with required content.", implementationGuide: "Include who, what, when, where, source, outcome.", evidenceRequired: ["Audit log samples"], relatedPolicies: ["pol-logging"], priority: "high", remediationStrategy: "Ensure logs contain required content elements." },
    { id: "800-au-6", domainId: "800-au", ref: "AU-6", title: "Audit Record Review, Analysis, and Reporting", objective: "Review and analyze audit records.", implementationGuide: "Establish review cadence.", evidenceRequired: ["Log review records"], relatedPolicies: ["pol-logging"], priority: "high", remediationStrategy: "Establish daily/weekly log review." },
    { id: "800-au-8", domainId: "800-au", ref: "AU-8", title: "Time Stamps", objective: "Use trusted time sources for timestamps.", implementationGuide: "Synchronize time via NTP.", evidenceRequired: ["NTP configuration"], relatedPolicies: ["pol-logging"], priority: "medium", remediationStrategy: "Use central NTP; monitor drift." },

    // Assessment, Authorization, & Monitoring (CA)
    { id: "800-ca-2", domainId: "800-ca", ref: "CA-2", title: "Control Assessments", objective: "Assess controls periodically.", implementationGuide: "Conduct annual control assessments.", evidenceRequired: ["Assessment reports"], relatedPolicies: ["pol-risk", "pol-infosec"], priority: "high", remediationStrategy: "Conduct annual control assessments." },
    { id: "800-ca-5", domainId: "800-ca", ref: "CA-5", title: "Plan of Action and Milestones (POA&M)", objective: "Develop and maintain POA&M.", implementationGuide: "Track remediation actions.", evidenceRequired: ["POA&M"], relatedPolicies: ["pol-risk"], priority: "high", remediationStrategy: "Maintain POA&M; review monthly." },
    { id: "800-ca-7", domainId: "800-ca", ref: "CA-7", title: "Continuous Monitoring", objective: "Establish continuous monitoring program.", implementationGuide: "Deploy continuous monitoring tools.", evidenceRequired: ["Monitoring reports"], relatedPolicies: ["pol-logging"], priority: "high", remediationStrategy: "Deploy continuous monitoring; review metrics." },

    // Configuration Management (CM)
    { id: "800-cm-2", domainId: "800-cm", ref: "CM-2", title: "Baseline Configuration", objective: "Develop and maintain baselines.", implementationGuide: "Document baseline configurations.", evidenceRequired: ["Baseline configuration repository"], relatedPolicies: ["pol-config"], essential: true, priority: "high", remediationStrategy: "Document baselines; version control." },
    { id: "800-cm-6", domainId: "800-cm", ref: "CM-6", title: "Configuration Settings", objective: "Enforce mandatory configuration settings.", implementationGuide: "Apply hardening benchmarks.", evidenceRequired: ["Configuration compliance scans"], relatedPolicies: ["pol-config"], priority: "high", remediationStrategy: "Apply hardening; monitor compliance." },
    { id: "800-cm-7", domainId: "800-cm", ref: "CM-7", title: "Least Functionality", objective: "Restrict functions to essential.", implementationGuide: "Disable unnecessary services.", evidenceRequired: ["Service inventory"], relatedPolicies: ["pol-config"], priority: "medium", remediationStrategy: "Disable unnecessary functions; review." },
    { id: "800-cm-8", domainId: "800-cm", ref: "CM-8", title: "System Component Inventory", objective: "Develop and maintain component inventory.", implementationGuide: "Use automated discovery.", evidenceRequired: ["Component inventory"], relatedPolicies: ["pol-asset"], priority: "high", remediationStrategy: "Maintain component inventory; automate discovery." },

    // Contingency Planning (CP)
    { id: "800-cp-2", domainId: "800-cp", ref: "CP-2", title: "Contingency Plan", objective: "Develop contingency plan.", implementationGuide: "Document and test contingency plan.", evidenceRequired: ["Contingency plan"], relatedPolicies: ["pol-bcdr"], priority: "critical", remediationStrategy: "Document and maintain contingency plan; test annually." },
    { id: "800-cp-3", domainId: "800-cp", ref: "CP-3", title: "Contingency Training", objective: "Train personnel on contingency plan.", implementationGuide: "Provide contingency training.", evidenceRequired: ["Training records"], relatedPolicies: ["pol-bcdr", "pol-training"], priority: "medium", remediationStrategy: "Train personnel annually on contingency." },
    { id: "800-cp-9", domainId: "800-cp", ref: "CP-9", title: "System Backup", objective: "Conduct and test backups.", implementationGuide: "Automated backups; test restoration.", evidenceRequired: ["Backup configuration", "Test reports"], relatedPolicies: ["pol-bcdr"], essential: true, priority: "high", remediationStrategy: "Automate backups; test restoration quarterly." },
    { id: "800-cp-10", domainId: "800-cp", ref: "CP-10", title: "System Recovery and Reconstitution", objective: "Provide system recovery capability.", implementationGuide: "Test reconstitution procedures.", evidenceRequired: ["Recovery test reports"], relatedPolicies: ["pol-bcdr"], priority: "high", remediationStrategy: "Test recovery and reconstitution annually." },

    // Identification and Authentication (IA)
    { id: "800-ia-2", domainId: "800-ia", ref: "IA-2", title: "Identification and Authentication (Organizational Users)", objective: "Uniquely identify and authenticate users.", implementationGuide: "Enforce unique IDs and MFA.", evidenceRequired: ["MFA enforcement evidence"], relatedPolicies: ["pol-access"], essential: true, priority: "critical", remediationStrategy: "Enforce unique IDs and MFA across users." },
    { id: "800-ia-5", domainId: "800-ia", ref: "IA-5", title: "Authenticator Management", objective: "Manage authenticators through lifecycle.", implementationGuide: "Enforce password policies; secure credential storage.", evidenceRequired: ["Authenticator management procedure"], relatedPolicies: ["pol-access"], priority: "high", remediationStrategy: "Manage authenticator lifecycle; secure storage." },
    { id: "800-ia-8", domainId: "800-ia", ref: "IA-8", title: "Identification and Authentication (Non-Organizational Users)", objective: "Identify and authenticate non-organizational users.", implementationGuide: "Apply authentication for external users.", evidenceRequired: ["External auth evidence"], relatedPolicies: ["pol-access"], priority: "medium", remediationStrategy: "Apply MFA for non-organizational users." },

    // Incident Response (IR)
    { id: "800-ir-4", domainId: "800-ir", ref: "IR-4", title: "Incident Handling", objective: "Implement incident handling capability.", implementationGuide: "Maintain documented incident handling process.", evidenceRequired: ["Incident handling procedure"], relatedPolicies: ["pol-ir"], essential: true, priority: "critical", remediationStrategy: "Maintain incident handling process; test annually." },
    { id: "800-ir-5", domainId: "800-ir", ref: "IR-5", title: "Incident Monitoring", objective: "Track and document information system incidents.", implementationGuide: "Track incidents in central system.", evidenceRequired: ["Incident tracking records"], relatedPolicies: ["pol-ir"], priority: "high", remediationStrategy: "Track incidents in central system." },
    { id: "800-ir-6", domainId: "800-ir", ref: "IR-6", title: "Incident Reporting", objective: "Report incidents to authorities.", implementationGuide: "Define incident reporting workflow.", evidenceRequired: ["Incident reports"], relatedPolicies: ["pol-ir"], priority: "high", remediationStrategy: "Define reporting workflow; train reporters." },
    { id: "800-ir-8", domainId: "800-ir", ref: "IR-8", title: "Incident Response Plan", objective: "Develop and maintain IR plan.", implementationGuide: "Review and update IR plan annually.", evidenceRequired: ["IR plan review log"], relatedPolicies: ["pol-ir"], essential: true, priority: "high", remediationStrategy: "Maintain and test IR plan annually." },

    // Maintenance (MA)
    { id: "800-ma-2", domainId: "800-ma", ref: "MA-2", title: "Controlled Maintenance", objective: "Schedule and document maintenance.", implementationGuide: "Maintain maintenance records.", evidenceRequired: ["Maintenance records"], relatedPolicies: ["pol-config", "pol-asset"], priority: "medium", remediationStrategy: "Document maintenance activities; track." },
    { id: "800-ma-4", domainId: "800-ma", ref: "MA-4", title: "Nonlocal Maintenance", objective: "Approve and monitor nonlocal maintenance.", implementationGuide: "Use secure channels; monitor sessions.", evidenceRequired: ["Remote maintenance evidence"], relatedPolicies: ["pol-network", "pol-access"], priority: "high", remediationStrategy: "Approve and monitor nonlocal maintenance." },

    // Media Protection (MP)
    { id: "800-mp-4", domainId: "800-mp", ref: "MP-4", title: "Media Storage", objective: "Physically control and securely store media.", implementationGuide: "Use locked storage.", evidenceRequired: ["Storage evidence"], relatedPolicies: ["pol-physical", "pol-asset"], priority: "medium", remediationStrategy: "Use locked storage; restrict access." },
    { id: "800-mp-6", domainId: "800-mp", ref: "MP-6", title: "Media Sanitization", objective: "Sanitize media before disposal.", implementationGuide: "Apply NIST SP 800-88 sanitization.", evidenceRequired: ["Sanitization records"], relatedPolicies: ["pol-asset", "pol-dataclass"], priority: "high", remediationStrategy: "Sanitize media; record disposal certificates." },

    // Physical and Environmental Protection (PE)
    { id: "800-pe-2", domainId: "800-pe", ref: "PE-2", title: "Physical Access Authorizations", objective: "Develop and maintain physical access lists.", implementationGuide: "Maintain access lists.", evidenceRequired: ["Physical access list"], relatedPolicies: ["pol-physical"], priority: "high", remediationStrategy: "Maintain physical access lists; review quarterly." },
    { id: "800-pe-3", domainId: "800-pe", ref: "PE-3", title: "Physical Access Control", objective: "Enforce physical access controls.", implementationGuide: "Use badges, biometrics, or guards.", evidenceRequired: ["Access control logs"], relatedPolicies: ["pol-physical"], essential: true, priority: "high", remediationStrategy: "Enforce physical access; review logs." },
    { id: "800-pe-6", domainId: "800-pe", ref: "PE-6", title: "Monitoring Physical Access", objective: "Monitor physical access.", implementationGuide: "Use CCTV and alarm systems.", evidenceRequired: ["CCTV footage"], relatedPolicies: ["pol-physical"], priority: "medium", remediationStrategy: "Deploy CCTV; review incidents." },
    { id: "800-pe-8", domainId: "800-pe", ref: "PE-8", title: "Visitor Access Records", objective: "Maintain visitor access records.", implementationGuide: "Log visitors with name, organization, escort.", evidenceRequired: ["Visitor logs"], relatedPolicies: ["pol-physical"], priority: "medium", remediationStrategy: "Maintain visitor logs for at least one year." },

    // Planning (PL)
    { id: "800-pl-2", domainId: "800-pl", ref: "PL-2", title: "System Security and Privacy Plans (SSP)", objective: "Develop SSPs.", implementationGuide: "Document SSPs for all systems.", evidenceRequired: ["SSP"], relatedPolicies: ["pol-infosec"], priority: "high", remediationStrategy: "Develop and maintain SSPs for all systems." },
    { id: "800-pl-4", domainId: "800-pl", ref: "PL-4", title: "Rules of Behavior", objective: "Establish rules of behavior.", implementationGuide: "Document rules of behavior; require acknowledgment.", evidenceRequired: ["Rules of behavior"], relatedPolicies: ["pol-infosec", "pol-hr"], priority: "medium", remediationStrategy: "Publish rules of behavior; require acknowledgment." },

    // Personnel Security (PS)
    { id: "800-ps-3", domainId: "800-ps", ref: "PS-3", title: "Personnel Screening", objective: "Screen personnel before access.", implementationGuide: "Conduct background checks.", evidenceRequired: ["Screening records"], relatedPolicies: ["pol-hr"], priority: "high", remediationStrategy: "Implement screening for sensitive roles." },
    { id: "800-ps-4", domainId: "800-ps", ref: "PS-4", title: "Personnel Termination", objective: "Securely terminate personnel access.", implementationGuide: "Use termination checklists.", evidenceRequired: ["Termination records"], relatedPolicies: ["pol-hr", "pol-access"], priority: "high", remediationStrategy: "Maintain termination checklist; integrate with IAM." },
    { id: "800-ps-5", domainId: "800-ps", ref: "PS-5", title: "Personnel Transfer", objective: "Manage personnel transfers.", implementationGuide: "Review and adjust access on transfer.", evidenceRequired: ["Transfer records"], relatedPolicies: ["pol-hr", "pol-access"], priority: "medium", remediationStrategy: "Review access on role change." },

    // PII Processing and Transparency (PT)
    { id: "800-pt-1", domainId: "800-pt", ref: "PT-1", title: "Privacy Notice", objective: "Provide privacy notices.", implementationGuide: "Publish privacy notices.", evidenceRequired: ["Privacy notice"], relatedPolicies: ["pol-privacy"], priority: "high", remediationStrategy: "Publish layered privacy notices." },
    { id: "800-pt-3", domainId: "800-pt", ref: "PT-3", title: "Personally Identifiable Information Processing Purposes", objective: "Identify PII processing purposes.", implementationGuide: "Document purposes and lawful basis.", evidenceRequired: ["PII processing purposes"], relatedPolicies: ["pol-privacy"], priority: "high", remediationStrategy: "Document PII purposes; review annually." },

    // Risk Assessment (RA)
    { id: "800-ra-3", domainId: "800-ra", ref: "RA-3", title: "Risk Assessment", objective: "Conduct risk assessments.", implementationGuide: "Conduct formal risk assessment annually.", evidenceRequired: ["Risk assessment report"], relatedPolicies: ["pol-risk"], essential: true, priority: "high", remediationStrategy: "Conduct annual risk assessments; document findings." },
    { id: "800-ra-5", domainId: "800-ra", ref: "RA-5", title: "Vulnerability Monitoring and Scanning", objective: "Monitor and scan for vulnerabilities.", implementationGuide: "Run authenticated vulnerability scans.", evidenceRequired: ["Vulnerability scan reports"], relatedPolicies: ["pol-vuln"], essential: true, priority: "high", remediationStrategy: "Run weekly vuln scans; patch by SLA." },

    // System and Services Acquisition (SA)
    { id: "800-sa-3", domainId: "800-sa", ref: "SA-3", title: "System Development Life Cycle", objective: "Manage SDLC.", implementationGuide: "Apply secure SDLC practices.", evidenceRequired: ["SDLC documentation"], relatedPolicies: ["pol-sdlc"], priority: "high", remediationStrategy: "Document and apply secure SDLC." },
    { id: "800-sa-9", domainId: "800-sa", ref: "SA-9", title: "External System Services", objective: "Manage external service risks.", implementationGuide: "Maintain SLAs and security requirements.", evidenceRequired: ["External service agreements"], relatedPolicies: ["pol-vendor"], priority: "high", remediationStrategy: "Maintain external service agreements." },
    { id: "800-sa-15", domainId: "800-sa", ref: "SA-15", title: "Development Process, Standards, and Tools", objective: "Follow secure development standards.", implementationGuide: "Adopt secure coding standards.", evidenceRequired: ["Development standards"], relatedPolicies: ["pol-sdlc"], priority: "high", remediationStrategy: "Adopt secure development standards." },

    // System and Communications Protection (SC)
    { id: "800-sc-7", domainId: "800-sc", ref: "SC-7", title: "Boundary Protection", objective: "Monitor and control boundary communications.", implementationGuide: "Deploy firewalls and segmentation.", evidenceRequired: ["Boundary protection architecture"], relatedPolicies: ["pol-network"], essential: true, priority: "high", remediationStrategy: "Deploy boundary protection; default-deny." },
    { id: "800-sc-8", domainId: "800-sc", ref: "SC-8", title: "Transmission Confidentiality and Integrity", objective: "Protect confidentiality and integrity of transmitted information.", implementationGuide: "Use TLS 1.2+ for all transmissions.", evidenceRequired: ["TLS configuration"], relatedPolicies: ["pol-crypto"], priority: "high", remediationStrategy: "Enforce TLS 1.2+; monitor cert expiry." },
    { id: "800-sc-13", domainId: "800-sc", ref: "SC-13", title: "Cryptographic Protection", objective: "Implement cryptographic mechanisms per applicable standards.", implementationGuide: "Use FIPS-validated cryptography where required.", evidenceRequired: ["Cryptographic module documentation"], relatedPolicies: ["pol-crypto"], priority: "high", remediationStrategy: "Use FIPS-validated crypto where required." },
    { id: "800-sc-28", domainId: "800-sc", ref: "SC-28", title: "Protection of Information at Rest", objective: "Protect information at rest.", implementationGuide: "Encrypt sensitive data at rest.", evidenceRequired: ["Encryption configuration"], relatedPolicies: ["pol-crypto"], priority: "high", remediationStrategy: "Encrypt data at rest with AES-256." },

    // System and Information Integrity (SI)
    { id: "800-si-2", domainId: "800-si", ref: "SI-2", title: "Flaw Remediation", objective: "Identify, report, and correct system flaws.", implementationGuide: "Patch within defined SLAs.", evidenceRequired: ["Patch management records"], relatedPolicies: ["pol-vuln"], essential: true, priority: "high", remediationStrategy: "Track and patch flaws per severity SLAs." },
    { id: "800-si-3", domainId: "800-si", ref: "SI-3", title: "Malicious Code Protection", objective: "Implement malicious code protection.", implementationGuide: "Deploy anti-malware across systems.", evidenceRequired: ["Anti-malware deployment report"], relatedPolicies: ["pol-endpoint"], priority: "high", remediationStrategy: "Deploy EDR/anti-malware; maintain signatures." },
    { id: "800-si-4", domainId: "800-si", ref: "SI-4", title: "System Monitoring", objective: "Monitor system for attacks and compromise.", implementationGuide: "Deploy continuous monitoring tooling.", evidenceRequired: ["Monitoring configuration"], relatedPolicies: ["pol-logging"], priority: "high", remediationStrategy: "Deploy continuous monitoring with alert thresholds." },
    { id: "800-si-8", domainId: "800-si", ref: "SI-8", title: "Spam Protection", objective: "Detect and prevent spam.", implementationGuide: "Deploy spam filtering.", evidenceRequired: ["Spam filtering logs"], relatedPolicies: ["pol-network"], priority: "medium", remediationStrategy: "Deploy spam filtering; monitor." },

    // Supply Chain Risk Management (SR)
    { id: "800-sr-3", domainId: "800-sr", ref: "SR-3", title: "Supply Chain Controls and Processes", objective: "Implement supply chain controls.", implementationGuide: "Apply security controls across the supply chain.", evidenceRequired: ["Supply chain controls"], relatedPolicies: ["pol-vendor"], priority: "high", remediationStrategy: "Apply supply chain controls; document." },
    { id: "800-sr-6", domainId: "800-sr", ref: "SR-6", title: "Supplier Assessments and Reviews", objective: "Assess suppliers regularly.", implementationGuide: "Conduct supplier assessments.", evidenceRequired: ["Supplier assessments"], relatedPolicies: ["pol-vendor"], priority: "high", remediationStrategy: "Conduct supplier assessments annually." },
    { id: "800-sr-11", domainId: "800-sr", ref: "SR-11", title: "Component Authenticity", objective: "Verify component authenticity.", implementationGuide: "Use anti-counterfeit controls.", evidenceRequired: ["Authenticity evidence"], relatedPolicies: ["pol-vendor", "pol-asset"], priority: "medium", remediationStrategy: "Verify component authenticity; track provenance." },

    // Program Management (PM)
    { id: "800-pm-1", domainId: "800-pm", ref: "PM-1", title: "Information Security Program Plan", objective: "Develop and maintain security program plan.", implementationGuide: "Document program plan; review annually.", evidenceRequired: ["Security program plan"], relatedPolicies: ["pol-infosec"], priority: "high", remediationStrategy: "Develop and maintain program plan." },
    { id: "800-pm-2", domainId: "800-pm", ref: "PM-2", title: "Information Security Program Leadership Role", objective: "Appoint a security leader.", implementationGuide: "Designate senior security official.", evidenceRequired: ["Role designation"], relatedPolicies: ["pol-infosec"], priority: "high", remediationStrategy: "Designate senior security official." },
    { id: "800-pm-9", domainId: "800-pm", ref: "PM-9", title: "Risk Management Strategy", objective: "Develop a risk management strategy.", implementationGuide: "Document strategy; align with organizational goals.", evidenceRequired: ["Risk management strategy"], relatedPolicies: ["pol-risk"], priority: "high", remediationStrategy: "Develop risk management strategy." },
    { id: "800-pm-15", domainId: "800-pm", ref: "PM-15", title: "Security and Privacy Groups and Associations", objective: "Engage with security groups.", implementationGuide: "Join industry groups (e.g., ISACs).", evidenceRequired: ["Membership records"], relatedPolicies: ["pol-infosec"], priority: "low", remediationStrategy: "Join industry security groups." },
  ],
};
