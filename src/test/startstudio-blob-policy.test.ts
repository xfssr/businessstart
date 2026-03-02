import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const putMock = vi.fn();

vi.mock("@vercel/blob", () => ({
  list: vi.fn(),
  put: (...args: unknown[]) => putMock(...args),
}));

describe("StartStudio Blob policy", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.BLOB_READ_WRITE_TOKEN = "token";
    process.env.STARTSTUDIO_BLOB_ACCESS = "private";
    putMock.mockResolvedValue({
      pathname: "startstudio/media/he/example.png",
      url: "https://blob.example/startstudio/media/he/example.png",
    });
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("always uploads with private access and returns proxy url", async () => {
    const { uploadStartStudioMedia } = await import("@/lib/startstudio");

    const file = new File(["demo"], "example.png", { type: "image/png" });
    const result = await uploadStartStudioMedia({
      file,
      locale: "he",
      title: "Example",
    });

    expect(putMock).toHaveBeenCalledTimes(1);
    expect(putMock.mock.calls[0]?.[2]).toMatchObject({ access: "private" });
    expect(result.url.startsWith("/api/startstudio/media?pathname=")).toBe(true);
  });

  it("throws when blob access is set to public", async () => {
    process.env.STARTSTUDIO_BLOB_ACCESS = "public";
    const { uploadStartStudioMedia } = await import("@/lib/startstudio");

    const file = new File(["demo"], "example.png", { type: "image/png" });

    await expect(
      uploadStartStudioMedia({
        file,
        locale: "en",
        title: "Example",
      }),
    ).rejects.toThrow("STARTSTUDIO_BLOB_ACCESS must be 'private'");
  });
});
