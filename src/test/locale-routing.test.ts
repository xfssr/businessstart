import { replaceLocaleInPath } from "@/lib/locale-routing";

describe("locale routing", () => {
  it("replaces locale segment and preserves path", () => {
    expect(replaceLocaleInPath("/he/services/item", "en")).toBe("/en/services/item");
    expect(replaceLocaleInPath("/en/solutions", "he")).toBe("/he/solutions");
  });

  it("adds locale for paths without locale", () => {
    expect(replaceLocaleInPath("/pricing", "he")).toBe("/he/pricing");
    expect(replaceLocaleInPath("/", "en")).toBe("/en");
  });
});
