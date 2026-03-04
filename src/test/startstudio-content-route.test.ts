import { beforeEach, describe, expect, it, vi } from "vitest";

const isAdminAuthorizedMock = vi.fn();
const ensureStartStudioContentMock = vi.fn();
const saveStartStudioContentMock = vi.fn();

vi.mock("@/lib/startstudio", () => ({
  isAdminAuthorized: (...args: unknown[]) => isAdminAuthorizedMock(...args),
  ensureStartStudioContent: (...args: unknown[]) => ensureStartStudioContentMock(...args),
  saveStartStudioContent: (...args: unknown[]) => saveStartStudioContentMock(...args),
}));

describe("PUT /api/startstudio/content", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isAdminAuthorizedMock.mockReturnValue(true);
    ensureStartStudioContentMock.mockResolvedValue({
      locales: { he: {}, en: {} },
      mediaLibrary: [],
      updatedAt: "2026-03-01T00:00:00.000Z",
    });
    saveStartStudioContentMock.mockResolvedValue("https://blob.example/startstudio/content.json");
  });

  it("writes locale patch to blob content", async () => {
    const { PUT } = await import("@/app/api/startstudio/content/route");

    const request = new Request("http://localhost/api/startstudio/content", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "x-startstudio-key": "secret",
      },
      body: JSON.stringify({
        locale: "he",
        messages: { hero: { title: "New title" } },
        whatsappNumber: "972500000000",
      }),
    });

    const response = await PUT(request);
    const payload = (await response.json()) as { ok: boolean; blobUrl?: string };

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.blobUrl).toContain("blob.example");
    expect(saveStartStudioContentMock).toHaveBeenCalledTimes(1);

    const saved = saveStartStudioContentMock.mock.calls[0]?.[0] as {
      locales: Record<string, { messages?: Record<string, unknown> }>;
      global?: { whatsappNumber?: string };
      updatedAt: string;
    };

    expect(saved.locales.he.messages).toEqual({ hero: { title: "New title" } });
    expect(saved.global?.whatsappNumber).toBe("972500000000");
    expect(typeof saved.updatedAt).toBe("string");
  });

  it("rejects invalid locale", async () => {
    const { PUT } = await import("@/app/api/startstudio/content/route");

    const request = new Request("http://localhost/api/startstudio/content", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        locale: "de",
        messages: {},
      }),
    });

    const response = await PUT(request);
    expect(response.status).toBe(400);
  });
});
