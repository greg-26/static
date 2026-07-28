#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const modal = readFileSync(resolve(root, 'src/components/MovieModal.vue'), 'utf8');
const api = readFileSync(resolve(root, 'src/lib/ohanaApi.js'), 'utf8');
const packageJson = readFileSync(resolve(root, 'package.json'), 'utf8');

function cssBlock(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = modal.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`));
  return match?.[1] || '';
}

const contentRatingBlock = cssBlock('.content-rating-pill');
const unavailableBlock = cssBlock('.content-rating-pill--unavailable');

const checks = [
  {
    name: 'API normalizer carries through contentRating from title detail responses',
    pass: /function normalizeContentRating\(contentRating\)/.test(api)
      && /contentRating: normalizeContentRating\(data\.contentRating\)/.test(api)
      && /rating,\n\s+region,\n\s+source: contentRating\.source \|\| null,\n\s+fallback: Boolean\(contentRating\.fallback\)/.test(api),
  },
  {
    name: 'movie detail computes a compact region-plus-rating label without choosing fallback candidates in the UI',
    pass: /const apiContentRating = computed\(\(\) => apiDetail\.value\?\.contentRating \|\| null\);/.test(modal)
      && /return `\$\{apiContentRating\.value\.region\} \$\{apiContentRating\.value\.rating\}`;/.test(modal)
      && !/release_dates|content_ratings|selectRegion|fallback order/i.test(modal),
  },
  {
    name: 'content rating appears in the compatibility details action area before legacy/static badges',
    pass: /<div class="compatibility-actions">[\s\S]*class="content-rating-pill"[\s\S]*<UiBadge v-if="movie\.mpa" tone="gold">/.test(modal),
  },
  {
    name: 'unavailable API content rating is handled cleanly after detail load',
    pass: /return "Rating unavailable";/.test(modal)
      && /content-rating-pill--unavailable/.test(modal)
      && /TMDB content rating unavailable/.test(modal),
  },
  {
    name: 'content rating badge stays compact and mobile-friendly',
    pass: /flex-shrink: 0;/.test(contentRatingBlock)
      && /white-space: nowrap;/.test(contentRatingBlock)
      && /font-size: 11px;/.test(contentRatingBlock)
      && /color: rgba\(240,238,232,0\.58\);/.test(unavailableBlock)
      && /\.compatibility-summary-head \{ flex-direction: column; \}/.test(modal),
  },
  {
    name: 'package exposes sprint 37 QA command',
    pass: /"qa:sprint37": "node scripts\/qa-sprint37-content-ratings\.mjs"/.test(packageJson),
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
  console.error(`\n${failed} sprint 37 QA check(s) failed.`);
  process.exit(1);
}

console.log('\nSprint 37 content-ratings QA checks passed.');
