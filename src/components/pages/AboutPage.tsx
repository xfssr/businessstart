"use client";

import { CardModule } from "@/components/CardModule";
import { Grid } from "@/components/Grid";
import { Section } from "@/components/Section";
import { useLocale } from "@/components/LocaleProvider";

export function AboutPage() {
  const { get, t } = useLocale();
  const points = get<string[]>("aboutPage.points");
  const principles = get<string[]>("aboutPage.principles");

  return (
    <>
      <Section
        eyebrow={t("aboutPage.eyebrow")}
        title={t("aboutPage.title")}
        description={t("aboutPage.description")}
      >
        <Grid cols={3}>
          {points.map((point) => (
            <CardModule key={point}>
              <p className="text-sm leading-relaxed text-text-secondary">{point}</p>
            </CardModule>
          ))}
        </Grid>
      </Section>

      <Section
        eyebrow={t("aboutPage.principlesEyebrow")}
        title={t("aboutPage.principlesTitle")}
        description={t("aboutPage.principlesDescription")}
      >
        <Grid cols={3}>
          {principles.map((principle) => (
            <CardModule key={principle}>
              <p className="text-sm leading-relaxed text-text-secondary">{principle}</p>
            </CardModule>
          ))}
        </Grid>
      </Section>
    </>
  );
}
