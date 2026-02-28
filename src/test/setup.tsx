/* eslint-disable @next/next/no-img-element */
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import type { ImgHTMLAttributes } from "react";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  document.documentElement.dir = "rtl";
  document.documentElement.lang = "he";
});

vi.mock("next/image", () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => {
    const { alt, src, ...rest } = props;
    const resolvedSrc = typeof src === "string" ? src : "";
    return <img {...rest} src={resolvedSrc} alt={alt ?? ""} />;
  },
}));
