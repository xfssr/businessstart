import { buildSeoMetadata } from "@/lib/seo";

describe("SEO metadata builder", () => {
  it("builds canonical and hreflang alternates", () => {
    const metadata = buildSeoMetadata({
      locale: "he",
      path: "/services",
      title: "Services",
      description: "Description",
    });

    expect(metadata.alternates?.canonical).toContain("/he/services");
    expect(metadata.alternates?.languages?.he).toContain("/he/services");
    expect(metadata.alternates?.languages?.en).toContain("/en/services");
  });

  it("applies noindex when requested", () => {
    const metadata = buildSeoMetadata({
      locale: "en",
      path: "/solutions/item",
      title: "Item",
      description: "Desc",
      noindex: true,
    });

    expect(metadata.robots).toEqual({ index: false, follow: true });
  });
});
