import type { Metadata } from "next";

import { LocaleProvider } from "@/components/LocaleProvider";

import "./globals.css";

const bootstrapDirectionScript = `
  (function () {
    try {
      var stored = localStorage.getItem("vgl-locale");
      var locale = stored === "en" || stored === "he" ? stored : "he";
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === "he" ? "rtl" : "ltr";
    } catch (error) {
      document.documentElement.lang = "he";
      document.documentElement.dir = "rtl";
    }
  })();
`;

export const metadata: Metadata = {
  title: "Creative Growth Laboratory",
  description:
    "Premium bilingual business launch studio: content, digital packaging, promotion, and first-lead support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootstrapDirectionScript }} />
      </head>
      <body className="min-h-screen bg-surface-base font-sans text-text-primary antialiased">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
