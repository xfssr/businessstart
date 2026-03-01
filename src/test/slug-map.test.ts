import { resolveAlternateSlug, resolveLocalizedSlug } from "@/lib/slug-map";

describe("slug mapping", () => {
  const pair = {
    he: "צילום-אוכל",
    en: "food-photography",
  };

  it("returns localized slug by locale", () => {
    expect(resolveLocalizedSlug(pair, "he")).toBe("צילום-אוכל");
    expect(resolveLocalizedSlug(pair, "en")).toBe("food-photography");
  });

  it("returns alternate slug by locale", () => {
    expect(resolveAlternateSlug(pair, "he")).toBe("food-photography");
    expect(resolveAlternateSlug(pair, "en")).toBe("צילום-אוכל");
  });
});
