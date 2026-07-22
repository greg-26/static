import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { DISCOVER_VISIBLE_DEDUPE_SLOTS, diversifyDiscoverRowStarts, stableDiscoverMovieKey } from "../src/lib/discoverRows.js";

const root = resolve(import.meta.dirname, "..");
const source = await readFile(resolve(root, "src/lib/discoverRows.js"), "utf8");
const readme = await readFile(resolve(root, "README.md"), "utf8");
const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));

const checks = [];
const pass = (name, ok, detail = "") => checks.push({ name, ok, detail });

function visibleDuplicates(rows) {
  const seen = new Map();
  const dupes = [];
  for (const row of rows) {
    for (const movie of row.movies.slice(0, DISCOVER_VISIBLE_DEDUPE_SLOTS)) {
      const key = stableDiscoverMovieKey(movie);
      if (seen.has(key)) dupes.push(`${key} in ${seen.get(key)} and ${row.id}`);
      else seen.set(key, row.id);
    }
  }
  return dupes;
}

const fixtureRows = [
  { id: "recommended", movies: [{ id: "a", t: "A" }, { id: "b", t: "B" }, { id: "c", t: "C" }] },
  { id: "popular", movies: [{ id: "a", t: "A" }, { id: "d", t: "D" }, { id: "e", t: "E" }] },
  { id: "genre", movies: [{ id: "b", t: "B" }, { id: "d", t: "D" }, { id: "f", t: "F" }, { id: "g", t: "G" }] },
];
const diversifiedFixture = diversifyDiscoverRowStarts(fixtureRows);

pass("visible slot constant stays at first two posters", DISCOVER_VISIBLE_DEDUPE_SLOTS === 2);
pass("fixture has no duplicate first-visible titles", visibleDuplicates(diversifiedFixture).length === 0, visibleDuplicates(diversifiedFixture).join("; "));
pass("duplicates are pushed deeper when alternatives exist", diversifiedFixture[1].movies[0].id === "d" && diversifiedFixture[1].movies[1].id === "e" && diversifiedFixture[1].movies[2].id === "a");
pass("visible duplicates are dropped when no fresh alternatives exist", diversifyDiscoverRowStarts([
  { id: "one", movies: [{ id: "a" }, { id: "b" }] },
  { id: "two", movies: [{ id: "a" }, { id: "b" }] },
]).length === 1);
pass("code documents fully-visible future model", /fully-visible tracking|fully visible cards/i.test(source));
pass("README points to Discover row dedupe implementation", /Discover row deduplication/i.test(readme) && /src\/lib\/discoverRows\.js/.test(readme));
pass("package exposes qa:sprint18", packageJson.scripts?.["qa:sprint18"] === "node scripts/qa-sprint18-discover-dedupe.mjs");

const moviesPath = resolve(root, "public/movies.json");
if (existsSync(moviesPath)) {
  const data = JSON.parse(await readFile(moviesPath, "utf8"));
  const movies = (data.movies || []).filter((movie) => movie.p).slice(0, 1200);
  const rows = [
    { id: "top", movies: movies.slice(0, 80) },
    { id: "overlap-a", movies: [...movies.slice(0, 8), ...movies.slice(80, 150)] },
    { id: "overlap-b", movies: [...movies.slice(1, 9), ...movies.slice(150, 220)] },
  ];
  const realDataDupes = visibleDuplicates(diversifyDiscoverRowStarts(rows));
  pass("real-data sample has no duplicate first-visible titles", realDataDupes.length === 0, realDataDupes.join("; "));
} else {
  pass("real-data sample skipped cleanly when public/movies.json is absent", true);
}

const failed = checks.filter((check) => !check.ok);
for (const check of checks) {
  console.log(`${check.ok ? "✓" : "✗"} ${check.name}${check.detail ? ` — ${check.detail}` : ""}`);
}
if (failed.length) process.exit(1);
