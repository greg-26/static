#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const modal = readFileSync(resolve(root, 'src/components/MovieModal.vue'), 'utf8');
const packageJson = readFileSync(resolve(root, 'package.json'), 'utf8');

function indexOfOrFail(needle) {
  const index = modal.indexOf(needle);
  return index;
}

const titleIndex = indexOfOrFail('<h2 :id="titleId" class="modal-title">{{ movie.t }}</h2>');
const primaryActionsIndex = indexOfOrFail('modal-user-actions modal-user-actions--primary');
const compatibilityIndex = indexOfOrFail('class="profile-glance"');
const providersIndex = indexOfOrFail('class="modal-providers"');
const posterButtonIndex = indexOfOrFail('ref="posterButtonRef"');
const posterViewerIndex = indexOfOrFail('class="poster-viewer"');

const checks = [
  {
    name: 'list/watch actions moved into the top decision area before maturity and providers',
    pass: titleIndex >= 0
      && primaryActionsIndex > titleIndex
      && primaryActionsIndex < compatibilityIndex
      && primaryActionsIndex < providersIndex
      && !/<!-- User actions \(watched \+ lists\) -->[\s\S]*modal-user-actions(?! modal-user-actions--primary)/.test(modal),
  },
  {
    name: 'existing watched/list store methods remain wired without persistence rewrite',
    pass: /userStore\.toggleWatched\(movie\.id\)/.test(modal)
      && /userStore\.toggleMovieInList\(list\.token, movie\.id\)/.test(modal)
      && /userStore\.isInList\(list\.token, movie\.id\)/.test(modal)
      && !/merge|KV|localStorage\.setItem/.test(modal),
  },
  {
    name: 'poster is a keyboard-focusable enlargement control using the existing best poster source',
    pass: posterButtonIndex >= 0
      && /type="button"[\s\S]*class="modal-poster modal-poster--button"[\s\S]*@click="openPosterViewer"/.test(modal)
      && /const posterImageSrc = computed\(\(\) => apiDetail\.value\?\.posterImage\?\.url \|\| props\.movie\?\.p\?\.replace\('w342', 'w500'\) \|\| null\)/.test(modal),
  },
  {
    name: 'poster viewer has dialog semantics, visible close, backdrop close, Escape close, and focus return',
    pass: posterViewerIndex >= 0
      && /role="dialog"[\s\S]*aria-modal="true"/.test(modal)
      && /@click\.self="closePosterViewer"/.test(modal)
      && /@keydown="handlePosterViewerKeydown"/.test(modal)
      && /ref="posterViewerCloseRef"[\s\S]*aria-label="Close poster view"/.test(modal)
      && /event\.key === "Escape"[\s\S]*closePosterViewer\(\)/.test(modal)
      && /posterButtonRef\.value\?\.focus/.test(modal),
  },
  {
    name: 'poster viewer is temporary overlay; default modal poster remains compact',
    pass: /\.modal-poster \{[\s\S]*width: 140px;[\s\S]*aspect-ratio: 2 \/ 3;/.test(modal)
      && /@media \(max-width: 560px\)[\s\S]*\.modal-poster \{[\s\S]*width: 108px;/.test(modal)
      && /\.poster-viewer \{[\s\S]*position: fixed;[\s\S]*z-index: 200;/.test(modal)
      && /\.poster-viewer img \{[\s\S]*object-fit: contain;/.test(modal),
  },
  {
    name: 'top list actions are visually separate from maturity/profile chips',
    pass: /\.modal-user-actions--primary \{[\s\S]*margin: -4px 0 16px;/.test(modal)
      && /\.modal-user-actions--primary \.user-actions-row \{[\s\S]*overflow-x: auto;/.test(modal)
      && /\.profile-glance-pill--ok/.test(modal),
  },
  {
    name: 'package exposes sprint 23 QA command',
    pass: /"qa:sprint23": "node scripts\/qa-sprint23-detail-actions-poster\.mjs"/.test(packageJson),
  },
];

let failed = 0;
for (const check of checks) {
  if (check.pass) console.log(`✓ ${check.name}`);
  else {
    failed += 1;
    console.error(`✗ ${check.name}`);
  }
}

if (failed) {
  console.error(`\n${failed} sprint 23 QA check(s) failed.`);
  process.exit(1);
}

console.log('\nSprint 23 detail actions/poster QA checks passed.');
