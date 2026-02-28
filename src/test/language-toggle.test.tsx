import { fireEvent, screen, waitFor } from "@testing-library/react";

import { LanguageToggle } from "@/components/LanguageToggle";
import { LOCALE_STORAGE_KEY } from "@/lib/constants";

import { renderWithLocale } from "./renderWithLocale";

describe("LanguageToggle", () => {
  it("switches direction to ltr and persists locale", async () => {
    renderWithLocale(<LanguageToggle />);

    fireEvent.click(screen.getByRole("button", { name: "EN" }));

    await waitFor(() => {
      expect(document.documentElement.dir).toBe("ltr");
    });

    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe("en");
  });
});
