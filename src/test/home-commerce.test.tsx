import { fireEvent, screen, within } from "@testing-library/react";

import { HomePage } from "@/components/pages/HomePage";

import { renderWithLocale } from "./renderWithLocale";

describe("home commerce catalog", () => {
  it("renders 6 services + 5 solutions with modal details and card WhatsApp links", () => {
    renderWithLocale(<HomePage />, "en");

    const detailButtons = screen.getAllByRole("button", { name: "Details" });
    expect(detailButtons).toHaveLength(11);

    const cardWhatsAppLinks = screen.getAllByRole("link", { name: "Choose on WhatsApp" });
    expect(cardWhatsAppLinks).toHaveLength(11);
    expect(cardWhatsAppLinks[0]).toHaveAttribute(
      "href",
      expect.stringContaining("https://wa.me/972509656366?text="),
    );

    fireEvent.click(detailButtons[0]);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole("button", { name: /close/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
