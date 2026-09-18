"use client";

import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { OnboardingModal } from "@/components/OnboardingModal";
import { FrameworkSelector } from "@/components/FrameworkSelector";
import { AssessmentChecklist } from "@/components/AssessmentChecklist";
import { PolicyChecklist } from "@/components/PolicyChecklist";
import { ReportSummaryModal } from "@/components/ReportSummaryModal";
import { EmailLeadModal } from "@/components/EmailLeadModal";
import { FeedbackModal } from "@/components/FeedbackModal";
import { CollaborationBanner } from "@/components/CollaborationBanner";
import { frameworks, getFramework } from "@/data/frameworks";
import { getDemoState } from "@/data/demoData";
import { AssessmentState, ControlStatus, FrameworkId } from "@/lib/types";
import { scoreAllFrameworks, scoreFramework } from "@/lib/scoring";
import { loadState, saveState, emptyState, clearState } from "@/lib/storage";
import { exportFrameworkCsv, exportFrameworkJson } from "@/lib/exportUtils";
import { generateGapAssessmentPdf } from "@/lib/pdfGenerator";
import { trackEvent } from "@/lib/analytics";

type View = "landing" | "frameworks" | "assessment" | "policies";

export default function Home() {
  const [state, setState] = useState<AssessmentState>(emptyState);
  const [hydrated, setHydrated] = useState(false);
  const [view, setView] = useState<View>("landing");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    const loaded = loadState();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage on mount
    setState(loaded);
    if (loaded.meta.companyName && loaded.activeFramework) {
      setView(loaded.activeFramework === "policies" ? "policies" : "assessment");
    } else if (loaded.meta.companyName) {
      setView("frameworks");
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const scores = useMemo(
    () =>
      Object.fromEntries(
        scoreAllFrameworks(frameworks, state.controlAssessments).map((s) => [s.frameworkId, s])
      ) as Record<FrameworkId, ReturnType<typeof scoreFramework>>,
    [state.controlAssessments]
  );

  const activeFramework =
    state.activeFramework && state.activeFramework !== "policies"
      ? getFramework(state.activeFramework)
      : null;

  const activeScore = activeFramework ? scores[activeFramework.id] : null;

  function handleStart() {
    if (state.meta.companyName) {
      setView("frameworks");
    } else {
      setShowOnboarding(true);
    }
  }

  function handleOnboardingSubmit(companyName: string, role: string) {
    setState((s) => ({
      ...s,
      meta: { ...s.meta, companyName, assessorRole: role, createdAt: new Date().toISOString() },
    }));
    setShowOnboarding(false);
    setView("frameworks");
    trackEvent("assessment_started");
  }

  function handleSelectFramework(id: FrameworkId) {
    setState((s) => ({ ...s, activeFramework: id }));
    setView("assessment");
    trackEvent("framework_selected", { framework: id });
  }

  function handleSelectPolicies() {
    setState((s) => ({ ...s, activeFramework: "policies" }));
    setView("policies");
  }

  function handleStatusChange(controlId: string, status: ControlStatus) {
    setState((s) => ({
      ...s,
      controlAssessments: {
        ...s.controlAssessments,
        [controlId]: { ...s.controlAssessments[controlId], controlId, status, updatedAt: new Date().toISOString() },
      },
    }));

    if (activeFramework && activeScore) {
      const willBeComplete =
        activeScore.unmarked <= 1 &&
        activeFramework.controls.every(
          (c) => c.id === controlId || (state.controlAssessments[c.id]?.status ?? "unmarked") !== "unmarked"
        );
      if (willBeComplete) {
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        trackEvent("assessment_completed", { framework: activeFramework.id });
      }
    }
  }

  function handlePolicyStatusChange(policyId: string, status: ControlStatus) {
    setState((s) => ({
      ...s,
      policyAssessments: {
        ...s.policyAssessments,
        [policyId]: { ...s.policyAssessments[policyId], policyId, status },
      },
    }));
  }

  function handleNotesChange(controlId: string, notes: string) {
    setState((s) => ({
      ...s,
      controlAssessments: {
        ...s.controlAssessments,
        [controlId]: {
          ...s.controlAssessments[controlId],
          controlId,
          status: s.controlAssessments[controlId]?.status ?? "unmarked",
          notes,
        },
      },
    }));
  }

  function handleLoadDemo() {
    setState(getDemoState());
    setView("assessment");
  }

  function handleReset() {
    clearState();
    setState(emptyState);
    setView("landing");
  }

  function handleDownloadPdf() {
    if (!activeFramework || !activeScore) return;
    generateGapAssessmentPdf(activeFramework, activeScore, state);
    trackEvent("pdf_downloaded", { framework: activeFramework.id });
  }

  async function handleEmailSubmit(email: string): Promise<boolean> {
    if (!activeFramework || !activeScore) return false;
    try {
      const res = await fetch("/api/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          companyName: state.meta.companyName,
          frameworkName: activeFramework.name,
          readinessPct: activeScore.readinessPct,
          gapCount: activeScore.gap,
          riskLevel: activeScore.riskLevel,
        }),
      });
      trackEvent("email_submitted", { framework: activeFramework.id });
      return res.ok;
    } catch {
      return false;
    }
  }

  async function handleFeedbackSubmit(rating: number, feedback: string) {
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, feedback, frameworkName: activeFramework?.name }),
      });
    } catch {
      // best-effort — feedback UI already confirms submission
    }
    trackEvent("feedback_submitted");
  }

  if (!hydrated) return null;

  return (
    <div className="min-h-screen">
      <Navbar
        companyName={state.meta.companyName}
        onLoadDemo={handleLoadDemo}
        onReset={handleReset}
        onBack={() => {
          if (view === "assessment" || view === "policies") setView("frameworks");
          else if (view === "frameworks") setView("landing");
        }}
        showBack={view !== "landing"}
      />

      {view === "landing" && <HeroSection onStart={handleStart} />}

      {view === "frameworks" && (
        <FrameworkSelector onSelect={handleSelectFramework} onSelectPolicies={handleSelectPolicies} scores={scores} />
      )}

      {view === "assessment" && activeFramework && activeScore && (
        <AssessmentChecklist
          framework={activeFramework}
          assessments={state.controlAssessments}
          score={activeScore}
          onBack={() => setView("frameworks")}
          onStatusChange={handleStatusChange}
          onNotesChange={handleNotesChange}
          onExport={() => setShowReportModal(true)}
        />
      )}

      {view === "policies" && (
        <PolicyChecklist
          assessments={state.policyAssessments}
          onStatusChange={handlePolicyStatusChange}
          onBack={() => setView("frameworks")}
        />
      )}

      {view !== "landing" && (
        <div className="mx-auto max-w-7xl px-6 pb-4">
          <button onClick={() => setShowFeedbackModal(true)} className="text-xs text-[var(--text-muted)] underline">
            Rate this assessment
          </button>
        </div>
      )}

      <CollaborationBanner />

      {showOnboarding && (
        <OnboardingModal onSubmit={handleOnboardingSubmit} onClose={() => setShowOnboarding(false)} />
      )}

      {showReportModal && activeFramework && activeScore && (
        <ReportSummaryModal
          framework={activeFramework}
          score={activeScore}
          state={state}
          onClose={() => setShowReportModal(false)}
          onDownloadPdf={handleDownloadPdf}
          onDownloadCsv={() => exportFrameworkCsv(activeFramework, state)}
          onDownloadJson={() => exportFrameworkJson(activeFramework, state)}
          onEmailReport={() => {
            setShowReportModal(false);
            setShowEmailModal(true);
          }}
        />
      )}

      {showEmailModal && <EmailLeadModal onClose={() => setShowEmailModal(false)} onSubmit={handleEmailSubmit} />}

      {showFeedbackModal && (
        <FeedbackModal onClose={() => setShowFeedbackModal(false)} onSubmit={handleFeedbackSubmit} />
      )}
    </div>
  );
}
