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

  it("renders examples gallery and solutions prompt before process", () => {
    const { container } = renderWithLocale(<HomePage />, "en");

    const whatWeDo = container.querySelector("#what-we-do");
    const examplesGallery = container.querySelector("#examples-gallery");
    const solutionsPrompt = container.querySelector("#solutions-prompt");
    const process = container.querySelector("#process");

    expect(whatWeDo).toBeInTheDocument();
    expect(examplesGallery).toBeInTheDocument();
    expect(solutionsPrompt).toBeInTheDocument();
    expect(process).toBeInTheDocument();

    const isAfterWhatWeDo = Boolean(
      whatWeDo &&
        examplesGallery &&
        (whatWeDo.compareDocumentPosition(examplesGallery) & Node.DOCUMENT_POSITION_FOLLOWING),
    );
    const isPromptAfterGallery = Boolean(
      examplesGallery &&
        solutionsPrompt &&
        (examplesGallery.compareDocumentPosition(solutionsPrompt) & Node.DOCUMENT_POSITION_FOLLOWING),
    );
    const isProcessAfterPrompt = Boolean(
      solutionsPrompt &&
        process &&
        (solutionsPrompt.compareDocumentPosition(process) & Node.DOCUMENT_POSITION_FOLLOWING),
    );

    expect(isAfterWhatWeDo).toBe(true);
    expect(isPromptAfterGallery).toBe(true);
    expect(isProcessAfterPrompt).toBe(true);

    expect(container.querySelectorAll("#examples-gallery video").length).toBeGreaterThanOrEqual(1);

    const promptCards = solutionsPrompt?.querySelectorAll("h3") ?? [];
    expect(promptCards.length).toBeGreaterThanOrEqual(3);
    expect(promptCards.length).toBeLessThanOrEqual(5);

    const solutionsCta = screen.getByRole("link", { name: "View all solutions" });
    expect(solutionsCta).toHaveAttribute("href", "/en/solutions");
  });
});
