import { describe, expect, it } from "vitest";
import { isValidImdbTitleId } from "../src/validation/imdb";

describe("IMDb title ID validation", () => {
  it("accepts valid title IDs", () => {
    expect(isValidImdbTitleId("tt0133093")).toBe(true);
  });

  it.each(["0133093", "tt", "ttabc", "nm0133093", "tt0133093/..", "tt0133093%2F.."])(
    "rejects invalid title ID %s",
    (imdbId) => {
      expect(isValidImdbTitleId(imdbId)).toBe(false);
    },
  );
});
