import { screen } from "@testing-library/react";

import { buildWhatsAppHref, WhatsAppLink } from "@/components/WhatsAppLink";
import { WHATSAPP_PHONE } from "@/lib/constants";

import { renderWithLocale } from "./renderWithLocale";

describe("WhatsAppLink", () => {
  it("renders the expected wa.me href format", () => {
    renderWithLocale(<WhatsAppLink label="Chat on WhatsApp" message="hello world" />);

    const link = screen.getByRole("link", { name: "Chat on WhatsApp" });
    expect(link).toHaveAttribute("href", buildWhatsAppHref(WHATSAPP_PHONE, "hello world"));
    expect(link).toHaveAttribute("href", expect.stringMatching(/^https:\/\/wa\.me\/\d+\?text=/));
  });
});
