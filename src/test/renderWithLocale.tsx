import { render } from "@testing-library/react";
import type { ReactElement } from "react";

import { LocaleProvider } from "@/components/LocaleProvider";
import { type Locale } from "@/lib/constants";

export function renderWithLocale(ui: ReactElement, locale: Locale = "he") {
  return render(<LocaleProvider initialLocale={locale}>{ui}</LocaleProvider>);
}
