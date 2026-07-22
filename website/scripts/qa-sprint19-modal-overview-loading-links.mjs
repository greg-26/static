#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const modal = readFileSync(resolve(root, 'src/components/MovieModal.vue'), 'utf8');
const packageJson = readFileSync(resolve(root, 'package.json'), 'utf8');

function indexOfOrFail(source, needle) {
  const index = source.indexOf(needle);
  return index;
}

const orderNeedles = [
  ['overview', 'class="modal-overview"'],
  ['parent guide', 'class="compatibility-summary"'],
  ['where to watch', 'class="modal-providers"'],
  ['collection', 'aria-labelledby="api-collection-label"'],
  ['seasons', 'aria-labelledby="api-seasons-label"'],
  ['cast', 'aria-labelledby="api-cast-label"'],
];

const orderIndexes = orderNeedles.map(([name, needle]) => [name, indexOfOrFail(modal, needle)]);
const orderPass = orderIndexes.every(([, index]) => index >= 0)
  && orderIndexes[0][1] < orderIndexes[1][1]
  && orderIndexes[1][1] < orderIndexes[2][1]
  && orderIndexes[2][1] < orderIndexes[3][1]
  && orderIndexes[2][1] < orderIndexes[4][1]
  && orderIndexes[4][1] < orderIndexes[5][1];

const checks = [
  {
    name: 'modal details follow overview, parent guide, watch, collection/seasons, cast order',
    pass: orderPass,
  },
  {
    name: 'overview has accessible read-more/read-less disclosure and mobile clamp',
    pass: /overviewExpanded = ref\(false\)/.test(modal)
      && /overviewCanToggle = computed\(\(\) => \(synopsis\.value \|\| ""\)\.length > 240\)/.test(modal)
      && /class="overview-toggle"/.test(modal)
      && /:aria-expanded="overviewExpanded \? 'true' : 'false'"/.test(modal)
      && /:aria-controls="overviewTextId"/.test(modal)
      && /overview-text--clamped/.test(modal)
      && /-webkit-line-clamp: 3/.test(modal),
  },
  {
    name: 'API detail loading has visible hero skeleton without touching poster layout',
    pass: /apiHeroLoading = computed/.test(modal)
      && /class="modal-hero-skeleton"/.test(modal)
      && /role="status"/.test(modal)
      && /aria-label="Loading backdrop image"/.test(modal)
      && /modal-hero--loading/.test(modal)
      && /\.modal-hero-skeleton\s*\{[\s\S]*position: absolute[\s\S]*inset: 0/.test(modal)
      && /\.modal-poster\s*\{[\s\S]*aspect-ratio: 2 \/ 3/.test(modal),
  },
  {
    name: 'TMDB link sits with IMDb/FilmAffinity and falls back to a real TMDB search URL',
    pass: /class="ext-site-link ext-site-link--tmdb"/.test(modal)
      && /aria-label="View on TMDB"/.test(modal)
      && /Tmdb\.new\.logo\.svg/.test(modal)
      && /tmdbExternalUrl = computed/.test(modal)
      && /extraDetails\.value\?\.tmdbUrl/.test(modal)
      && /https:\/\/www\.themoviedb\.org\/search\?query=/.test(modal),
  },
  {
    name: 'API failure keeps static overview fallback and error copy visible',
    pass: /if \(apiDetail\.value\?\.overview\) return apiDetail\.value\.overview/.test(modal)
      && /props\.movie\.overviewEs \|\| props\.movie\.overviewEn/.test(modal)
      && /extraDetails\.value\?\.synopsisEn/.test(modal)
      && /apiDetailError\.value = "Ohana detail unavailable; showing static info\."/.test(modal)
      && /v-else-if="apiDetailError"/.test(modal),
  },
  {
    name: 'package exposes sprint 19 QA command',
    pass: /"qa:sprint19": "node scripts\/qa-sprint19-modal-overview-loading-links\.mjs"/.test(packageJson),
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
  console.error(`\n${failed} sprint 19 QA check(s) failed.`);
  process.exit(1);
}

console.log('\nSprint 19 modal overview/loading/link QA checks passed.');
