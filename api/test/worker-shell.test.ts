import { describe, expect, it } from "vitest";
import worker from "../src/index";

async function readJson(response: Response): Promise<unknown> {
  return response.json();
}

describe("worker routing and errors", () => {
  it("routes a valid IMDb title ID to the placeholder title lookup response", async () => {
    const response = await worker.fetch(new Request("https://api.example.test/titles/tt0133093"));

    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe("application/json; charset=utf-8");
    expect(await readJson(response)).toEqual({
      error: {
        code: "title_not_found",
        message: "Title not found.",
      },
    });
  });

  it.each(["0133093", "tt", "tt0133093%2F.."])("returns 400 JSON for invalid IMDb ID %s", async (imdbId) => {
    const response = await worker.fetch(new Request(`https://api.example.test/titles/${imdbId}`));

    expect(response.status).toBe(400);
    expect(response.headers.get("content-type")).toBe("application/json; charset=utf-8");
    expect(await readJson(response)).toEqual({
      error: {
        code: "invalid_imdb_id",
        message: "Invalid IMDb ID.",
      },
    });
  });

  it("returns JSON for an unknown route", async () => {
    const response = await worker.fetch(new Request("https://api.example.test/unknown"));

    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe("application/json; charset=utf-8");
    expect(await readJson(response)).toEqual({
      error: {
        code: "route_not_found",
        message: "Route not found.",
      },
    });
  });

  it("returns deterministic JSON for an unsupported method", async () => {
    const response = await worker.fetch(new Request("https://api.example.test/titles/tt0133093", { method: "POST" }));

    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("GET");
    expect(response.headers.get("content-type")).toBe("application/json; charset=utf-8");
    expect(await readJson(response)).toEqual({
      error: {
        code: "method_not_allowed",
        message: "Method not allowed.",
      },
    });
  });
});
