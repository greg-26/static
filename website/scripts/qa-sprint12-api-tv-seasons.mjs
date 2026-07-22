#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(resolve(root, path), 'utf8');

const pkg = JSON.parse(read('package.json'));
const api = read('src/lib/ohanaApi.js');
const modal = read('src/components/MovieModal.vue');

const checks = [
  {
    name: 'API client normalizes season count and compact season fields',
    pass: /function normalizeSeason/.test(api)
      && /seasonCount/.test(api)
      && /seasonNumber/.test(api)
      && /episodeCount/.test(api)
      && /posterUrl/.test(api)
      && /isSpecials/.test(api),
  },
  {
    name: 'API client de-emphasizes specials after regular seasons',
    pass: /a\.isSpecials !== b\.isSpecials/.test(api)
      && /a\.isSpecials \? 1 : -1/.test(api),
  },
  {
    name: 'Movie modal renders season summary, cards, and show-all disclosure',
    pass: /apiSeasonSummary/.test(modal)
      && /api-season-list/.test(modal)
      && /visibleApiSeasons/.test(modal)
      && /showAllApiSeasons/.test(modal)
      && /Show all/.test(modal),
  },
  {
    name: 'Season rows include poster fallback, episode metadata, overview, and specials state',
    pass: /api-season-poster-fallback/.test(modal)
      && /seasonMeta\(season\)/.test(modal)
      && /api-season-overview/.test(modal)
      && /api-season-card--specials/.test(modal),
  },
  {
    name: 'API loading failure fallback from Sprint 11 remains in place',
    pass: /apiDetailLoading/.test(modal)
      && /apiDetailError/.test(modal)
      && /Ohana detail unavailable; showing static info\./.test(modal),
  },
  {
    name: 'package exposes the Sprint 12 QA command',
    pass: pkg.scripts?.['qa:sprint12'] === 'node scripts/qa-sprint12-api-tv-seasons.mjs',
  },
];

let failed = 0;
for (const check of checks) {
  if (check.pass) {
    console.log(`✓ ${check.name}`);
  } else {
    failed += 1;
    console.error(`✗ ${check.name}`);
  }
}

if (failed) {
  console.error(`\n${failed} Sprint 12 API-TV-season QA check(s) failed.`);
  process.exit(1);
}

console.log('\nSprint 12 API-TV-season QA checks passed.');
