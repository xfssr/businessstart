import type { Metadata } from "next";
import { Rubik, Suez_One } from "next/font/google";

import { DEFAULT_SITE_URL } from "@/lib/constants";

import "./globals.css";

const uiFont = Rubik({
  subsets: ["latin", "hebrew"],
  variable: "--font-ui",
  display: "swap",
});

const headingFont = Suez_One({
  weight: "400",
  subsets: ["latin", "hebrew"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL),
  title: "Business Start Studio",
  description:
    "Premium bilingual business studio for content, digital packaging, and inquiry growth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he">
      <head>
        <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async />
      </head>
      <body
        className={`${uiFont.variable} ${headingFont.variable} min-h-screen bg-surface-base font-sans text-text-primary antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
