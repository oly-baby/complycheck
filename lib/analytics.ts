type PlausibleEvent =
  | "assessment_started"
  | "framework_selected"
  | "assessment_completed"
  | "pdf_downloaded"
  | "email_submitted"
  | "feedback_submitted";

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Record<string, string | number> }) => void;
  }
}

export function trackEvent(event: PlausibleEvent, props?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  try {
    window.plausible?.(event, props ? { props } : undefined);
  } catch {
    // analytics should never break the app
  }
}
