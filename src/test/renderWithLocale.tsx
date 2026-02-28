import { render } from "@testing-library/react";
import type { ReactElement } from "react";

import { LocaleProvider } from "@/components/LocaleProvider";

export function renderWithLocale(ui: ReactElement) {
  return render(<LocaleProvider>{ui}</LocaleProvider>);
}
