import type { Metadata } from "next";

import { DEFAULT_SITE_URL } from "@/lib/constants";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL),
  title: "Creative Growth Laboratory | Business Start Studio",
  description:
    "Premium bilingual business launch studio for content, digital packaging, and first leads.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface-base font-sans text-text-primary antialiased">{children}</body>
    </html>
  );
}
