"use client";

import { CardModule } from "@/components/CardModule";
import { LeadForm } from "@/components/LeadForm";
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
          <LeadForm labels={form} />
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
