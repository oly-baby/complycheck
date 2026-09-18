import type { Metadata } from "next";
import "@fontsource/fraunces/400.css";
import "@fontsource/fraunces/500.css";
import "@fontsource/fraunces/600.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PlausibleTracker } from "@/components/PlausibleTracker";
import "./globals.css";

export const metadata: Metadata = {
  title: "ComplyCheck — Compliance Readiness & Gap Assessment",
  description:
    "Assess your security posture against ISO 27001, NIST CSF, SOC 2, PCI-DSS, GDPR, NIST 800-53, HIPAA, and DORA — in your browser, in minutes.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased">
        <PlausibleTracker />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
