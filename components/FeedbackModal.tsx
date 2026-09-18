"use client";

import { useState } from "react";
import { X, Star } from "lucide-react";

export function FeedbackModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (rating: number, feedback: string) => void;
}) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="w-full max-w-sm rounded-xl border p-6"
        style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
      >
        <div className="mb-4 flex items-start justify-between">
          <h2 className="font-display text-xl font-medium">How did this go?</h2>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text)]">
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <p className="py-6 text-center text-sm text-[var(--text-muted)]">
            Thanks — that helps shape what we build next.
          </p>
        ) : (
          <>
            <div className="mb-4 flex justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onMouseEnter={() => setHovered(n)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(n)}
                >
                  <Star
                    size={26}
                    fill={(hovered || rating) >= n ? "var(--color-amber)" : "none"}
                    color={(hovered || rating) >= n ? "var(--color-amber)" : "var(--text-muted)"}
                  />
                </button>
              ))}
            </div>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Anything we should fix or add?"
              rows={3}
              className="mb-4 w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-emerald)]"
              style={{ borderColor: "var(--border)" }}
            />
            <button
              disabled={rating === 0}
              onClick={() => {
                onSubmit(rating, feedback);
                setSubmitted(true);
              }}
              className="w-full rounded-md py-2.5 text-sm font-medium text-white disabled:opacity-50"
              style={{ background: "var(--color-emerald)" }}
            >
              Submit feedback
            </button>
            <p className="mt-3 text-center text-xs text-[var(--text-muted)]">
              Want to collaborate on ComplyCheck? Reach out at{" "}
              <a href="mailto:trycomplycheck@gmail.com" className="underline">
                trycomplycheck@gmail.com
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
