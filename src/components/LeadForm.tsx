"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/Button";
import { useLocale } from "@/components/LocaleProvider";

type LeadFormLabels = {
  businessLabel: string;
  messageLabel: string;
  nameLabel: string;
  phoneLabel: string;
  submit: string;
  title: string;
};

type LeadFormProps = {
  labels: LeadFormLabels;
};

export function LeadForm({ labels }: LeadFormProps) {
  const { locale } = useLocale();
  const pathname = usePathname();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      business: String(formData.get("business") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      locale,
      sourcePath: pathname,
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Lead submission failed");
      }

      event.currentTarget.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const statusLabel =
    status === "success"
      ? locale === "he"
        ? "הפנייה נקלטה. נחזור אליכם בהקדם."
        : "Received. We will get back to you shortly."
      : status === "error"
        ? locale === "he"
          ? "אירעה שגיאה בשליחה. נסו שוב."
          : "Could not submit. Please try again."
        : "";

  return (
    <div className="space-y-4 rounded-xl border border-border-subtle bg-surface-base/55 p-4" id="lead-form">
      <p className="text-xs font-semibold tracking-[0.18em] text-text-muted uppercase">{labels.title}</p>
      <form className="grid gap-3 sm:grid-cols-2" onSubmit={onSubmit}>
        <label className="text-sm text-text-secondary">
          <span className="mb-1 block">{labels.nameLabel}</span>
          <input
            name="name"
            required
            type="text"
            className="w-full rounded-lg border border-border-subtle bg-surface-elevated px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-accent"
          />
        </label>
        <label className="text-sm text-text-secondary">
          <span className="mb-1 block">{labels.phoneLabel}</span>
          <input
            name="phone"
            required
            type="tel"
            className="w-full rounded-lg border border-border-subtle bg-surface-elevated px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-accent"
          />
        </label>
        <label className="text-sm text-text-secondary sm:col-span-2">
          <span className="mb-1 block">{labels.businessLabel}</span>
          <input
            name="business"
            type="text"
            className="w-full rounded-lg border border-border-subtle bg-surface-elevated px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-accent"
          />
        </label>
        <label className="text-sm text-text-secondary sm:col-span-2">
          <span className="mb-1 block">{labels.messageLabel}</span>
          <textarea
            name="message"
            required
            rows={4}
            className="w-full rounded-lg border border-border-subtle bg-surface-elevated px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-accent"
          />
        </label>
        <Button className="sm:col-span-2" type="submit" disabled={status === "submitting"}>
          {labels.submit}
        </Button>
      </form>
      <p aria-live="polite" className="text-sm text-text-muted">
        {statusLabel}
      </p>
    </div>
  );
}
