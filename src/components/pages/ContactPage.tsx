"use client";

import { Button } from "@/components/Button";
import { CardModule } from "@/components/CardModule";
import { Section } from "@/components/Section";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { useLocale } from "@/components/LocaleProvider";

type ContactChannel = {
  label: string;
  value: string;
};

type ContactFormLabels = {
  businessLabel: string;
  messageLabel: string;
  nameLabel: string;
  phoneLabel: string;
  submit: string;
  title: string;
};

export function ContactPage() {
  const { get, t } = useLocale();
  const channels = get<ContactChannel[]>("contact.channels");
  const form = get<ContactFormLabels>("contact.form");

  return (
    <Section
      eyebrow={t("contactPage.eyebrow")}
      title={t("contactPage.title")}
      description={t("contactPage.description")}
    >
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <CardModule className="space-y-6">
          <div className="flex flex-wrap gap-3">
            <WhatsAppLink label={t("contact.primaryCta")} message={t("whatsapp.prefill")} className="min-w-52" />
          </div>
          <div className="space-y-4 rounded-xl border border-border-subtle bg-surface-base/55 p-4">
            <p className="text-xs font-semibold tracking-[0.18em] text-text-muted uppercase">{form.title}</p>
            <form className="grid gap-3 sm:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
              <label className="text-sm text-text-secondary">
                <span className="mb-1 block">{form.nameLabel}</span>
                <input
                  type="text"
                  className="w-full rounded-lg border border-border-subtle bg-surface-elevated px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-accent"
                />
              </label>
              <label className="text-sm text-text-secondary">
                <span className="mb-1 block">{form.phoneLabel}</span>
                <input
                  type="tel"
                  className="w-full rounded-lg border border-border-subtle bg-surface-elevated px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-accent"
                />
              </label>
              <label className="text-sm text-text-secondary sm:col-span-2">
                <span className="mb-1 block">{form.businessLabel}</span>
                <input
                  type="text"
                  className="w-full rounded-lg border border-border-subtle bg-surface-elevated px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-accent"
                />
              </label>
              <label className="text-sm text-text-secondary sm:col-span-2">
                <span className="mb-1 block">{form.messageLabel}</span>
                <textarea
                  rows={4}
                  className="w-full rounded-lg border border-border-subtle bg-surface-elevated px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-accent"
                />
              </label>
              <Button className="sm:col-span-2">{form.submit}</Button>
            </form>
          </div>
        </CardModule>

        <CardModule>
          <ul className="space-y-4">
            {channels.map((channel) => (
              <li key={channel.label} className="border-b border-border-subtle pb-3 last:border-none last:pb-0">
                <p className="text-xs tracking-[0.16em] text-text-muted uppercase">{channel.label}</p>
                <p className="mt-1 text-sm font-semibold text-text-primary">{channel.value}</p>
              </li>
            ))}
          </ul>
        </CardModule>
      </div>
    </Section>
  );
}
