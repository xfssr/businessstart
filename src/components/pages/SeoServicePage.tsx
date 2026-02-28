"use client";

import { Button } from "@/components/Button";
import { CardModule } from "@/components/CardModule";
import { Section } from "@/components/Section";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { useLocale } from "@/components/LocaleProvider";

type SeoPageContent = {
  bullets: string[];
  description: string;
  price: string;
  title: string;
};

export function SeoServicePage({ slug }: { slug: string }) {
  const { get, locale, t } = useLocale();
  const pages = get<Record<string, SeoPageContent>>("seoPages");
  const content = pages[slug];

  if (!content) {
    return null;
  }

  return (
    <Section eyebrow={t("seoPage.eyebrow")} title={content.title} description={content.description}>
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <CardModule>
          <ul className="space-y-3">
            {content.bullets.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-text-secondary">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardModule>
        <CardModule className="space-y-4">
          <p className="text-xs tracking-[0.16em] text-text-muted uppercase">{t("seoPage.startingPrice")}</p>
          <p className="text-2xl font-semibold text-text-primary">{content.price}</p>
          <div className="flex flex-wrap gap-3">
            <WhatsAppLink label={t("seoPage.primaryCta")} message={t("whatsapp.prefill")} />
            <Button href={`/${locale}/contact`} variant="secondary">
              {t("seoPage.secondaryCta")}
            </Button>
          </div>
        </CardModule>
      </div>
    </Section>
  );
}
