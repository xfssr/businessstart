import { screen } from "@testing-library/react";

import { HomePage } from "@/components/pages/HomePage";

import { renderWithLocale } from "./renderWithLocale";

describe("home information architecture", () => {
  it("renders the new reduced section order and removes legacy homepage blocks", () => {
    const { container } = renderWithLocale(<HomePage />, "en");

    const home = container.querySelector("#home");
    const whatWeDo = container.querySelector("#what-we-do");
    const examplesGallery = container.querySelector("#examples-gallery");
    const solutionsPrompt = container.querySelector("#solutions-prompt");
    const process = container.querySelector("#process");
    const contact = container.querySelector("#contact");

    expect(home).toBeInTheDocument();
    expect(whatWeDo).toBeInTheDocument();
    expect(examplesGallery).toBeInTheDocument();
    expect(solutionsPrompt).toBeInTheDocument();
    expect(process).toBeInTheDocument();
    expect(contact).toBeInTheDocument();

    const isWhatWeDoAfterHome = Boolean(
      home && whatWeDo && (home.compareDocumentPosition(whatWeDo) & Node.DOCUMENT_POSITION_FOLLOWING),
    );
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
    const isContactAfterProcess = Boolean(
      process && contact && (process.compareDocumentPosition(contact) & Node.DOCUMENT_POSITION_FOLLOWING),
    );

    expect(isWhatWeDoAfterHome).toBe(true);
    expect(isAfterWhatWeDo).toBe(true);
    expect(isPromptAfterGallery).toBe(true);
    expect(isProcessAfterPrompt).toBe(true);
    expect(isContactAfterProcess).toBe(true);

    expect(container.querySelector("#audience")).not.toBeInTheDocument();
    expect(container.querySelector("#difference")).not.toBeInTheDocument();
    expect(container.querySelector("#services")).not.toBeInTheDocument();
    expect(container.querySelector("#solutions")).not.toBeInTheDocument();
    expect(container.querySelector("#outcomes")).not.toBeInTheDocument();
    expect(container.querySelector("#work")).not.toBeInTheDocument();
    expect(container.querySelector("#testimonials")).not.toBeInTheDocument();
    expect(container.querySelector("#faq")).not.toBeInTheDocument();
    expect(container.querySelector("#start")).not.toBeInTheDocument();
  });

  it("keeps hero/actions compact with curated cards and final lead form", () => {
    const { container } = renderWithLocale(<HomePage />, "en");

    const heroPrimary = screen.getByRole("link", { name: "View Solutions" });
    expect(heroPrimary).toHaveAttribute("href", "/en/solutions");

    const heroSecondary = screen.getByRole("link", { name: "Examples & Pricing" });
    expect(heroSecondary).toHaveAttribute("href", "/en/pricing");

    expect(container.querySelector('#home a[href^="https://wa.me/"]')).not.toBeInTheDocument();
    expect(container.querySelectorAll('[data-testid="hero-collage-item"]')).toHaveLength(5);
    expect(container.querySelectorAll('[data-testid="hero-mobile-example-item"]')).toHaveLength(5);
    expect(container.querySelectorAll('[data-testid="hero-flow-chip"]')).toHaveLength(0);

    const whatsappLinks = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href")?.startsWith("https://wa.me/"));
    expect(whatsappLinks.length).toBeGreaterThanOrEqual(1);
    expect(whatsappLinks[0]).toHaveAttribute("href", expect.stringContaining("https://wa.me/972509656366?text="));

    expect(container.querySelectorAll("#examples-gallery video").length).toBeGreaterThanOrEqual(1);
    expect(container.querySelectorAll("#what-we-do h3")).toHaveLength(3);
    expect(container.querySelectorAll("#solutions-prompt h3")).toHaveLength(3);
    expect(container.querySelectorAll("#process h3")).toHaveLength(3);

    const solutionsCta = screen.getByRole("link", { name: "Explore all solutions" });
    expect(solutionsCta).toHaveAttribute("href", "/en/solutions");
    expect(container.querySelector("#lead-form")).toBeInTheDocument();
  });

  it("applies hero-viewport-block only on the outer hero wrapper", () => {
    const { container } = renderWithLocale(<HomePage />, "en");

    const heroViewportBlocks = container.querySelectorAll("#home .hero-viewport-block");
    expect(heroViewportBlocks).toHaveLength(1);

    const heroContainer = container.querySelector("#home .hero-safe-padding");
    expect(heroContainer).toBeInTheDocument();
    expect(heroContainer).not.toHaveClass("hero-viewport-block");
  });
});
