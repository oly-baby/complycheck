import { Framework } from "@/lib/types";

export const gdpr: Framework = {
  id: "gdpr",
  name: "General Data Protection Regulation",
  shortName: "GDPR",
  version: "EU 2016/679",
  description:
    "EU regulation governing the collection, processing, and protection of personal data of individuals in the EU.",
  color: "#8B5CF6",
  domains: [
    { id: "gdpr-lawful", name: "Lawful Processing & Consent", description: "Legal basis for processing personal data." },
    { id: "gdpr-rights", name: "Data Subject Rights", description: "Access, rectification, erasure, and portability rights." },
    { id: "gdpr-accountability", name: "Accountability & Records", description: "Documentation demonstrating compliance." },
    { id: "gdpr-security", name: "Security of Processing", description: "Article 32 technical and organizational measures." },
    { id: "gdpr-breach", name: "Breach Notification", description: "Obligations following a personal data breach." },
    { id: "gdpr-vendor", name: "Third Parties & Transfers", description: "Processor agreements and international transfers." },
  ],
  controls: [
    { id: "gdpr-6.1", domainId: "gdpr-lawful", ref: "Art. 6", title: "Lawfulness of processing", objective: "Ensure a valid legal basis exists for each processing activity.", implementationGuide: "Document legal basis (consent, contract, legitimate interest, etc.) per processing activity.", evidenceRequired: ["Legal basis register"], relatedPolicies: ["pol-privacy"], essential: true },
    { id: "gdpr-7.1", domainId: "gdpr-lawful", ref: "Art. 7", title: "Conditions for consent", objective: "Ensure consent is freely given, specific, and revocable.", implementationGuide: "Implement consent capture and withdrawal mechanisms with audit trail.", evidenceRequired: ["Consent management records"], relatedPolicies: ["pol-privacy"] },
    { id: "gdpr-15", domainId: "gdpr-rights", ref: "Art. 15", title: "Right of access", objective: "Enable data subjects to obtain confirmation and access to their data.", implementationGuide: "Implement a DSAR intake and fulfillment process with SLA tracking.", evidenceRequired: ["DSAR log", "Response templates"], relatedPolicies: ["pol-privacy"], essential: true },
    { id: "gdpr-17", domainId: "gdpr-rights", ref: "Art. 17", title: "Right to erasure", objective: "Enable deletion of personal data upon valid request.", implementationGuide: "Implement deletion workflows across all systems storing personal data.", evidenceRequired: ["Deletion request log"], relatedPolicies: ["pol-privacy"] },
    { id: "gdpr-20", domainId: "gdpr-rights", ref: "Art. 20", title: "Right to data portability", objective: "Allow data subjects to receive their data in a portable format.", implementationGuide: "Provide export functionality in structured, machine-readable format.", evidenceRequired: ["Export tooling documentation"], relatedPolicies: ["pol-privacy"] },
    { id: "gdpr-30", domainId: "gdpr-accountability", ref: "Art. 30", title: "Records of processing activities", objective: "Maintain records demonstrating what personal data is processed and why.", implementationGuide: "Maintain a ROPA covering purpose, categories, retention, and recipients.", evidenceRequired: ["Records of Processing Activities (ROPA)"], relatedPolicies: ["pol-privacy"], essential: true },
    { id: "gdpr-35", domainId: "gdpr-accountability", ref: "Art. 35", title: "Data protection impact assessment (DPIA)", objective: "Assess risk before high-risk processing.", implementationGuide: "Conduct a DPIA for processing likely to result in high risk to individuals.", evidenceRequired: ["DPIA reports"], relatedPolicies: ["pol-privacy"], essential: true },
    { id: "gdpr-25", domainId: "gdpr-accountability", ref: "Art. 25", title: "Data protection by design and by default", objective: "Embed privacy considerations into system design.", implementationGuide: "Incorporate privacy review gates into the SDLC and new-feature process.", evidenceRequired: ["Privacy-by-design checklist"], relatedPolicies: ["pol-sdlc", "pol-privacy"] },
    { id: "gdpr-32", domainId: "gdpr-security", ref: "Art. 32", title: "Security of processing", objective: "Implement appropriate technical and organizational measures.", implementationGuide: "Apply encryption, pseudonymization, and resilience measures proportional to risk.", evidenceRequired: ["Security measures documentation"], relatedPolicies: ["pol-crypto", "pol-infosec"], essential: true },
    { id: "gdpr-33", domainId: "gdpr-breach", ref: "Art. 33", title: "Notification of a personal data breach to the supervisory authority", objective: "Notify authorities within required timeframes.", implementationGuide: "Maintain a breach response procedure with a 72-hour notification workflow.", evidenceRequired: ["Breach notification procedure"], relatedPolicies: ["pol-ir"], essential: true },
    { id: "gdpr-34", domainId: "gdpr-breach", ref: "Art. 34", title: "Communication of a breach to the data subject", objective: "Inform affected individuals when a breach poses high risk.", implementationGuide: "Define criteria and templates for notifying affected data subjects.", evidenceRequired: ["Notification templates"], relatedPolicies: ["pol-ir"] },
    { id: "gdpr-28", domainId: "gdpr-vendor", ref: "Art. 28", title: "Processor obligations", objective: "Ensure processors provide sufficient guarantees for GDPR compliance.", implementationGuide: "Execute Data Processing Agreements (DPAs) with all processors.", evidenceRequired: ["Signed DPAs"], relatedPolicies: ["pol-vendor"], essential: true },
    { id: "gdpr-44", domainId: "gdpr-vendor", ref: "Art. 44", title: "General principle for international transfers", objective: "Ensure lawful basis for transferring data outside the EU/EEA.", implementationGuide: "Use SCCs, adequacy decisions, or approved transfer mechanisms.", evidenceRequired: ["Transfer mechanism documentation"], relatedPolicies: ["pol-vendor"] },
  ],
};
