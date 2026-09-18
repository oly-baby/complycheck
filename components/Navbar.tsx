"use client";

import Image from "next/image";
import { Moon, Sun, Sparkles, ArrowLeft } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

export function Navbar({
  companyName,
  onLoadDemo,
  onReset,
  onBack,
  showBack,
}: {
  companyName?: string;
  onLoadDemo: () => void;
  onReset: () => void;
  onBack?: () => void;
  showBack?: boolean;
}) {
  const { theme, toggle } = useTheme();
  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-md"
      style={{ background: "color-mix(in srgb, var(--bg-elevated) 85%, transparent)" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        <div className="flex items-center gap-2.5">
          {showBack && onBack && (
            <button
              onClick={onBack}
              className="mr-1 flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
              style={{ borderColor: "var(--border)" }}
              aria-label="Back"
            >
              <ArrowLeft size={14} />
              Back
            </button>
          )}
          <div
            className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md"
            style={{ background: "var(--color-navy)" }}
          >
            <Image
              src="/icon.svg"
              alt="ComplyCheck"
              width={36}
              height={36}
              className="h-9 w-9"
              priority
            />
          </div>
          <span className="font-display text-lg font-medium tracking-tight">ComplyCheck</span>
          {companyName && (
            <span
              className="ml-2 hidden rounded-full border px-2.5 py-0.5 text-xs text-[var(--text-muted)] sm:inline-block"
              style={{ borderColor: "var(--border)" }}
            >
              {companyName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onLoadDemo}
            className="hidden items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text)] sm:flex"
            style={{ borderColor: "var(--border)" }}
          >
            <Sparkles size={14} />
            Load sample assessment
          </button>
          <button
            onClick={onReset}
            className="hidden rounded-md border px-3 py-1.5 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text)] sm:block"
            style={{ borderColor: "var(--border)" }}
          >
            Reset
          </button>
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:text-[var(--text)]"
            )}
            style={{ borderColor: "var(--border)" }}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>
    </header>
  );
}
