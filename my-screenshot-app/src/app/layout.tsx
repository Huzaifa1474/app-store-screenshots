import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const font = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "App Store Screenshots",
    template: "%s · App Store Screenshots",
  },
  description:
    "Design and export App Store + Google Play marketing screenshots with real device frames, connected canvas, and store-ready PNG bundles.",
  applicationName: "App Store Screenshots",
  keywords: [
    "App Store",
    "Google Play",
    "screenshots",
    "ASO",
    "marketing screenshots",
    "device frames",
  ],
  authors: [{ name: "Huzaifa" }],
  creator: "Huzaifa",
  openGraph: {
    title: "App Store Screenshots",
    description:
      "Design and export App Store + Google Play marketing screenshots with real device frames and store-ready PNG bundles.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className}>{children}</body>
    </html>
  );
}
