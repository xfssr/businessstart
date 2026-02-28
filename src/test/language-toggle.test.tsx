import { fireEvent, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { LanguageToggle } from "@/components/LanguageToggle";
import { LOCALE_STORAGE_KEY } from "@/lib/constants";

import { renderWithLocale } from "./renderWithLocale";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/he/services",
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("LanguageToggle", () => {
  it("switches direction to ltr and persists locale", async () => {
    renderWithLocale(<LanguageToggle />, "he");

    fireEvent.click(screen.getByRole("button", { name: "EN" }));

    await waitFor(() => {
      expect(document.documentElement.dir).toBe("ltr");
    });

    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe("en");
    expect(pushMock).toHaveBeenCalledWith("/en/services");
  });
});
