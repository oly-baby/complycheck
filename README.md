# ComplyCheck

**A free, open-source compliance readiness & gap-assessment tool for security, GRC, and engineering teams.**

🔗 **Live app:** [complycheck.com.ng](https://www.complycheck.com.ng/)

---

## What is ComplyCheck?

ComplyCheck helps security, GRC, and engineering teams quickly self-assess their organization's compliance posture across major frameworks — without needing expensive consultants or complex GRC platforms to get started.

Answer a structured set of questions per framework, and ComplyCheck generates a clear readiness report highlighting what's solid, what's partial, and what's missing — exportable as a PDF for internal use or audit prep.

### Frameworks covered
- ISO 27001:2022
- NIST CSF 2.0
- SOC 2 Type II
- PCI-DSS 4.0
- GDPR
- NIST SP 800-53 Rev 5
- HIPAA
- DORA
- General security policy checklist

---

## Why open source?

ComplyCheck is built to be transparent and trustworthy — the kind of tool GRC and security teams can actually inspect before relying on it. Open-sourcing the code lets anyone review the assessment logic, verify there's nothing shady going on with data handling, and contribute improvements as frameworks evolve.

👉 **The easiest way to use ComplyCheck is the hosted version at [complycheck.com.ng](https://www.complycheck.com.ng/)** — no setup required. This repo is here for transparency, learning, and contributions.

---

## Tech stack

- **Framework:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Icons:** Lucide
- **PDF export:** jsPDF / jspdf-autotable
- **Analytics:** Plausible (privacy-respecting, no cookies/tracking)
- **Hosting:** Vercel

---

## Getting started (for contributors)

\`\`\`bash
# Clone the repo
git clone https://github.com/oly-baby/complycheck.git
cd complycheck

# Install dependencies
npm install

# Run the dev server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see it running locally.

> **Note:** Self-hosting for production use isn't officially documented or supported yet. This setup is intended for local development and contribution purposes.

---

## Contributing

Contributions are welcome! Whether it's fixing a bug, improving a framework's control mapping, or suggesting a new feature:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Open a pull request describing what you changed and why

Found an issue or have a feature idea? Open a [GitHub Issue](https://github.com/oly-baby/complycheck/issues).

---

## License

ComplyCheck is licensed under the **GNU Affero General Public License v3.0 (AGPLv3)**.

This means you're free to use, study, and modify the code — but if you deploy a modified version as a public service, you're required to make your changes available under the same license. See [LICENSE](./LICENSE) for full terms.

---

## Feedback & collaboration

Have feedback, ideas, or want to collaborate? Reach out: **trycomplycheck@gmail.com**

---

*Built by Oluchi Faith Amadi — GRC and security Programs Lead, building tools to make compliance more accessible for teams everywhere.*
