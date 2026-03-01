import type { Metadata } from "next";

import { StartStudioAdmin } from "@/components/admin/StartStudioAdmin";

export const metadata: Metadata = {
  title: "StartStudio Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StartStudioPage() {
  return <StartStudioAdmin />;
}
