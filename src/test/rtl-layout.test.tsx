import { waitFor } from "@testing-library/react";

import Home from "@/app/page";

import { renderWithLocale } from "./renderWithLocale";

describe("RTL layout", () => {
  it("keeps rtl as default and matches the header snapshot", async () => {
    const { container } = renderWithLocale(<Home />);

    await waitFor(() => {
      expect(document.documentElement.dir).toBe("rtl");
    });

    expect(container.querySelector("header")).toMatchSnapshot();
  });
});
