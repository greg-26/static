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
    name: 'Ohana API client defaults to deployed Worker with env override',
    pass: /DEFAULT_API_BASE_URL = "https:\/\/ohanamovies-api\.ohanamovies-api\.workers\.dev"/.test(api)
      && /VITE_OHANA_API_BASE_URL/.test(api)
      && /VITE_OHANA_API_TIMEOUT_MS/.test(api),
  },
  {
    name: 'API client validates IMDb IDs, times out, and caches by title/config',
    pass: /isValidImdbId/.test(api)
      && /AbortController/.test(api)
      && /setTimeout/.test(api)
      && /titleCache/.test(api)
      && /cacheKey/.test(api),
  },
  {
    name: 'API client normalizes overview, cast, and collection items',
    pass: /normalizeTitleDetail/.test(api)
      && /overview/.test(api)
      && /normalizeCastMember/.test(api)
      && /normalizeCollectionItem/.test(api)
      && /collectionItems/.test(api),
  },
  {
    name: 'Movie modal lazily fetches API detail on open without blocking static detail',
    pass: /fetchOhanaTitleDetail/.test(modal)
      && /loadApiDetail\(movie\)/.test(modal)
      && /apiDetailLoading/.test(modal)
      && /apiDetailError/.test(modal)
      && /Ohana detail unavailable; showing static info\./.test(modal),
  },
  {
    name: 'API overview enriches the existing synopsis path instead of creating a duplicate about block',
    pass: /if \(apiDetail\.value\?\.overview\) return apiDetail\.value\.overview;/.test(modal)
      && !/modal-api-overview|api-overview/.test(modal),
  },
  {
    name: 'Cast and collection render compact supporting sections',
    pass: /api-cast-list/.test(modal)
      && /apiCastPreview/.test(modal)
      && /api-collection-list/.test(modal)
      && /apiCollectionItems/.test(modal),
  },
  {
    name: 'package exposes the Sprint 11 QA command',
    pass: pkg.scripts?.['qa:sprint11'] === 'node scripts/qa-sprint11-api-detail-foundation.mjs',
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
  console.error(`\n${failed} Sprint 11 API-detail QA check(s) failed.`);
  process.exit(1);
}

console.log('\nSprint 11 API-detail QA checks passed.');
