import en from "@/messages/en.json";
import he from "@/messages/he.json";

const REQUIRED_SERVICE_SLUGS = [
  "photography",
  "video-production",
  "reels-production",
  "editing-package",
  "content-day",
  "product-food-photography",
];

const REQUIRED_SOLUTION_SLUGS = [
  "qr-menu-mini-site",
  "content-whatsapp-funnel",
  "business-launch-setup",
  "beauty-booking-flow",
  "quick-start-system",
];

describe("commerce content integrity", () => {
  it("removes fake contact placeholders from HE/EN", () => {
    const payload = `${JSON.stringify(he)}${JSON.stringify(en)}`;
    expect(payload).not.toContain("+972-50-000-0000");
    expect(payload).not.toContain("hello@businessstart.example");
    expect(payload).not.toContain("@businessstart.studio");
  });

  it("uses the real business contacts in both locales", () => {
    for (const locale of [he, en]) {
      expect(locale.global.whatsappNumber).toBe("+972 50 9656366");
      expect(locale.global.phone).toBe("+972 50 9656366");
      expect(locale.global.email).toBe("nisenem98@gmail.com");
      expect(locale.global.instagram).toBe("emil_nisenblatt");
    }
  });

  it("keeps the Hebrew home critical labels fully localized", () => {
    expect(he.hero.panelLabel).toBe("\u05DE\u05D4 \u05DB\u05D5\u05DC\u05DC \u05D4\u05EA\u05D4\u05DC\u05D9\u05DA");
    expect(he.portfolio.items.map((item) => item.metric)).toEqual([
      "\u05D4\u05E9\u05E7\u05EA \u05DE\u05E1\u05E2\u05D3\u05D4",
      "\u05E0\u05DB\u05E1\u05D9 \u05EA\u05D5\u05DB\u05DF \u05DC\u05D0\u05D9\u05E8\u05D5\u05D7",
      "\u05E0\u05E8\u05D0\u05D5\u05EA \u05DE\u05D5\u05E6\u05E8",
    ]);
    expect(JSON.stringify(he)).not.toContain("Studio Focus");
    expect(JSON.stringify(he)).not.toContain("Restaurant Launch");
    expect(JSON.stringify(he)).not.toContain("Hospitality Assets");
    expect(JSON.stringify(he)).not.toContain("Product Presence");
  });

  it("enforces 6 services and 5 solutions with slugs and commerce fields", () => {
    expect(en.servicesPage.standardCards).toHaveLength(6);
    expect(he.servicesPage.standardCards).toHaveLength(6);
    expect(en.solutionsPage.cards).toHaveLength(5);
    expect(he.solutionsPage.cards).toHaveLength(5);

    for (const locale of [he, en]) {
      for (const card of locale.servicesPage.standardCards) {
        expect(card.title).toBeTruthy();
        expect(card.audience).toBeTruthy();
        expect(card.timeline).toBeTruthy();
        expect(card.price).toBeTruthy();
        expect(card.slug).toBeTruthy();
        expect(Array.isArray(card.features)).toBe(true);
      }

      for (const card of locale.solutionsPage.cards) {
        expect(card.title).toBeTruthy();
        expect(card.problem).toBeTruthy();
        expect(card.whatWeDo).toBeTruthy();
        expect(card.outcome).toBeTruthy();
        expect(card.timeline).toBeTruthy();
        expect(card.price).toBeTruthy();
        expect(card.slug).toBeTruthy();
      }
    }

    expect(en.servicesPage.standardCards.map((item) => item.slug)).toEqual(REQUIRED_SERVICE_SLUGS);
    expect(he.servicesPage.standardCards.map((item) => item.slug)).toEqual(REQUIRED_SERVICE_SLUGS);
    expect(en.solutionsPage.cards.map((item) => item.slug)).toEqual(REQUIRED_SOLUTION_SLUGS);
    expect(he.solutionsPage.cards.map((item) => item.slug)).toEqual(REQUIRED_SOLUTION_SLUGS);
  });

  it("has per-card WhatsApp message templates in both locales", () => {
    for (const locale of [he, en]) {
      expect(locale.whatsapp.serviceCardTemplate).toContain("{title}");
      expect(locale.whatsapp.serviceCardTemplate).toContain("{timeline}");
      expect(locale.whatsapp.solutionCardTemplate).toContain("{title}");
      expect(locale.whatsapp.solutionCardTemplate).toContain("{problem}");
      expect(locale.whatsapp.solutionCardTemplate).toContain("{outcome}");
    }
  });

  it("includes localized examples gallery and solutions prompt fallback blocks", () => {
    for (const locale of [he, en]) {
      expect(locale.examplesGallery.eyebrow).toBeTruthy();
      expect(locale.examplesGallery.title).toBeTruthy();
      expect(locale.examplesGallery.description).toBeTruthy();
      expect(Array.isArray(locale.examplesGallery.items)).toBe(true);
      expect(locale.examplesGallery.items.length).toBeGreaterThanOrEqual(3);
      expect(locale.examplesGallery.items.some((item) => item.mediaType === "video")).toBe(true);

      expect(locale.solutionsPrompt.eyebrow).toBeTruthy();
      expect(locale.solutionsPrompt.title).toBeTruthy();
      expect(locale.solutionsPrompt.description).toBeTruthy();
      expect(locale.solutionsPrompt.cta).toBeTruthy();
      expect(locale.solutionsPrompt.cards.length).toBeGreaterThanOrEqual(3);
      expect(locale.solutionsPrompt.cards.length).toBeLessThanOrEqual(5);
    }

    expect(he.solutionsPrompt.title).toBe("בחרו מסלול פתרון לעסק");
    expect(JSON.stringify(he.examplesGallery)).not.toContain("Need more than just content?");
  });
});

