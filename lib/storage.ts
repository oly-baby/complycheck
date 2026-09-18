import { AssessmentState } from "./types";

const STORAGE_KEY = "complycheck.assessment.v1";

export const emptyState: AssessmentState = {
  meta: {
    companyName: "",
    assessorRole: "",
    createdAt: "",
    updatedAt: "",
  },
  activeFramework: null,
  controlAssessments: {},
  policyAssessments: {},
};

export function loadState(): AssessmentState {
  if (typeof window === "undefined") return emptyState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState;
    const parsed = JSON.parse(raw) as AssessmentState;
    return {
      ...emptyState,
      ...parsed,
      meta: { ...emptyState.meta, ...parsed.meta },
    };
  } catch {
    return emptyState;
  }
}

export function saveState(state: AssessmentState) {
  if (typeof window === "undefined") return;
  try {
    const toSave: AssessmentState = {
      ...state,
      meta: { ...state.meta, updatedAt: new Date().toISOString() },
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // storage unavailable (private browsing, quota) — fail silently
  }
}

export function clearState() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
