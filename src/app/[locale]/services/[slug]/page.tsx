import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Button } from "@/components/Button";
import { CardModule } from "@/components/CardModule";
import { Container } from "@/components/Container";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { type Locale } from "@/lib/constants";
import { isLocale } from "@/lib/i18n";
import { absoluteUrl, buildSeoMetadata } from "@/lib/seo";
import {
  getLocaleMessages,
  getServiceLanding,
  getServiceLandingParams,
} from "@/lib/site-content";

type RouteProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  return getServiceLandingParams();
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;

  if (!isLocale(localeParam)) {
    return {};
  }

  const landing = await getServiceLanding(localeParam, slug);
  if (!landing) {
    return {};
  }

  return buildSeoMetadata({
    locale: localeParam,
    path: `/services/${landing.slug}`,
    title: landing.seoTitle,
    description: landing.seoDescription,
    noindex: landing.noindex,
    ogImage: landing.ogImage,
  });
}

export default async function ServiceLandingPage({ params }: RouteProps) {
  const { locale: localeParam, slug } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam as Locale;
  const landing = await getServiceLanding(locale, slug);
  const messages = await getLocaleMessages(locale);

  if (!landing) {
    notFound();
  }

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: landing.title,
      description: landing.description,
      areaServed: "Israel",
      provider: {
        "@type": "LocalBusiness",
        name: messages.brand.name,
        url: absoluteUrl(`/${locale}`),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: landing.title,
      description: landing.description,
      offers: {
        "@type": "Offer",
        priceCurrency: "ILS",
        priceSpecification: {
          "@type": "PriceSpecification",
          price: landing.price,
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: locale === "he" ? "בית" : "Home",
          item: absoluteUrl(`/${locale}`),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: locale === "he" ? "שירותים" : "Services",
          item: absoluteUrl(`/${locale}/services`),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: landing.title,
          item: absoluteUrl(`/${locale}/services/${landing.slug}`),
        },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="py-14 sm:py-20">
        <Container>
          <p className="mb-3 text-[0.66rem] font-semibold tracking-[0.26em] text-text-muted uppercase">
            {messages.seoPage.eyebrow}
          </p>
          <h1 className="max-w-4xl font-display text-4xl leading-tight text-text-primary sm:text-6xl">
            {landing.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-text-secondary sm:text-lg">
            {landing.description}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <WhatsAppLink label={messages.seoPage.primaryCta} message={messages.whatsapp.prefill} />
            <Button href={`/${locale}/contact`} variant="secondary">
              {messages.seoPage.secondaryCta}
            </Button>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <CardModule>
              <h2 className="font-display text-2xl text-text-primary">
                {locale === "he" ? "מה כלול בשירות" : "What Is Included"}
              </h2>
              <ul className="mt-4 space-y-2">
                {landing.bullets.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardModule>
            <CardModule>
              <h2 className="text-xs tracking-[0.16em] text-text-muted uppercase">
                {messages.seoPage.startingPrice}
              </h2>
              <p className="mt-3 text-2xl font-semibold text-text-primary">{landing.price}</p>
            </CardModule>
          </div>
        </Container>
      </section>
    </>
  );
}
