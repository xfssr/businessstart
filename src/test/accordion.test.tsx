import { fireEvent, screen } from "@testing-library/react";

import { Accordion } from "@/components/Accordion";

import { renderWithLocale } from "./renderWithLocale";

const items = [
  {
    answer: "First answer",
    question: "First question",
  },
  {
    answer: "Second answer",
    question: "Second question",
  },
];

describe("Accordion", () => {
  it("opens and closes an item", () => {
    renderWithLocale(<Accordion items={items} />);

    const firstButton = screen.getByRole("button", { name: "First question" });
    expect(firstButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("First answer")).toBeVisible();

    fireEvent.click(firstButton);
    expect(firstButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("First answer")).not.toBeVisible();
  });
});
