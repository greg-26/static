#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const modal = readFileSync(resolve(root, 'src/components/MovieModal.vue'), 'utf8');
const packageJson = readFileSync(resolve(root, 'package.json'), 'utf8');

const posterButtonBlock = modal.match(/<button\n\s+v-if="posterImageSrc"[\s\S]*?<\/button>/)?.[0] ?? '';

const checks = [
  {
    name: 'visible poster Expand affordance markup and styles were removed',
    pass: !/modal-poster-affordance/.test(modal)
      && !/>\s*Expand\s*</.test(modal),
  },
  {
    name: 'poster remains a focusable button that opens the poster viewer',
    pass: /ref="posterButtonRef"/.test(posterButtonBlock)
      && /type="button"/.test(posterButtonBlock)
      && /class="modal-poster modal-poster--button"/.test(posterButtonBlock)
      && /@click="openPosterViewer"/.test(posterButtonBlock),
  },
  {
    name: 'poster control retains accessible label and focus-visible treatment',
    pass: /:aria-label="`View \$\{movie\.t\} poster larger`"/.test(posterButtonBlock)
      && /\.modal-poster--button:focus-visible \{[\s\S]*outline: 3px solid/.test(modal),
  },
  {
    name: 'poster viewer activation and focus restoration remain wired',
    pass: /function openPosterViewer\(\) \{[\s\S]*posterViewerOpen\.value = true/.test(modal)
      && /function closePosterViewer\(\) \{[\s\S]*posterButtonRef\.value\?\.focus/.test(modal)
      && /@keydown="handlePosterViewerKeydown"/.test(modal),
  },
  {
    name: 'package exposes sprint 36 QA command',
    pass: /"qa:sprint36": "node scripts\/qa-sprint36-poster-expand-affordance\.mjs"/.test(packageJson),
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
  console.error(`\n${failed} sprint 36 QA check(s) failed.`);
  process.exit(1);
}

console.log('\nSprint 36 poster expand-affordance QA checks passed.');
