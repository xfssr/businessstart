import { waitFor } from "@testing-library/react";

import { HomePage } from "@/components/pages/HomePage";

import { renderWithLocale } from "./renderWithLocale";

describe("RTL layout", () => {
  it("keeps rtl as default and matches the header snapshot", async () => {
    const { container } = renderWithLocale(<HomePage />, "he");

    await waitFor(() => {
      expect(document.documentElement.dir).toBe("rtl");
    });

    expect(container.querySelector("section")).toMatchSnapshot();
  });
});
