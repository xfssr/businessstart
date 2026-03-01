import { vi } from "vitest";

const getServiceLandingMock = vi.fn();
const getSolutionLandingMock = vi.fn();

vi.mock("@/lib/site-content", () => ({
  getServiceLanding: (...args: unknown[]) => getServiceLandingMock(...args),
  getServiceLandingParams: vi.fn(async () => []),
  getSolutionLanding: (...args: unknown[]) => getSolutionLandingMock(...args),
  getSolutionLandingParams: vi.fn(async () => []),
  getLocaleMessages: vi.fn(async () => ({
    brand: { name: "Business Start Studio" },
    seoPage: {
      eyebrow: "Service direction",
      primaryCta: "WhatsApp",
      secondaryCta: "Get a quote",
      startingPrice: "From",
    },
    whatsapp: { prefill: "Hello" },
  })),
}));

describe("route metadata integration", () => {
  it("builds hreflang/canonical for service landing pages", async () => {
    const { generateMetadata } = await import("@/app/[locale]/services/[slug]/page");

    getServiceLandingMock.mockResolvedValueOnce({
      slug: "food-photography",
      seoTitle: "Food Photography",
      seoDescription: "Food photography service",
    });

    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "he", slug: "food-photography" }),
    });

    expect(metadata.alternates?.canonical).toContain("/he/services/food-photography");
    expect(metadata.alternates?.languages?.he).toContain("/he/services/food-photography");
    expect(metadata.alternates?.languages?.en).toContain("/en/services/food-photography");
  });

  it("builds hreflang/canonical for solution landing pages", async () => {
    const { generateMetadata } = await import("@/app/[locale]/solutions/[slug]/page");

    getSolutionLandingMock.mockResolvedValueOnce({
      slug: "beauty-booking",
      seoTitle: "Beauty Booking",
      seoDescription: "Beauty booking flow",
    });

    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en", slug: "beauty-booking" }),
    });

    expect(metadata.alternates?.canonical).toContain("/en/solutions/beauty-booking");
    expect(metadata.alternates?.languages?.he).toContain("/he/solutions/beauty-booking");
    expect(metadata.alternates?.languages?.en).toContain("/en/solutions/beauty-booking");
  });
});
