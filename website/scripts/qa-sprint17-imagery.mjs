#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(resolve(root, path), 'utf8');

const modal = read('src/components/MovieModal.vue');
const api = read('src/lib/ohanaApi.js');

const checks = [
  {
    name: 'API normalization exposes poster and horizontal hero image candidates from artwork',
    pass: /function normalizeHeroImageCandidates\(artwork\)/.test(api)
      && /artwork\.backdrop/.test(api)
      && /artwork\.backdrops/.test(api)
      && /artwork\.stills/.test(api)
      && /posterImage: normalizePosterImage\(data\.artwork\)/.test(api)
      && /heroImageCandidates: normalizeHeroImageCandidates\(data\.artwork\)/.test(api),
  },
  {
    name: 'Movie detail renders a separate horizontal hero and portrait poster',
    pass: /class="modal-visuals"/.test(modal)
      && /class="modal-hero"/.test(modal)
      && /selectedHeroImage/.test(modal)
      && /class="modal-poster"/.test(modal)
      && /posterImageSrc/.test(modal),
  },
  {
    name: 'Portrait poster aspect ratio is preserved on desktop and mobile',
    pass: /\.modal-poster \{[\s\S]*?aspect-ratio: 2 \/ 3;/.test(modal)
      && !/\.modal-poster \{ width: 100%; height: 200px; \}/.test(modal)
      && !/object-position: center top;/.test(modal),
  },
  {
    name: 'Hero image selection is random once per modal open without computed flicker',
    pass: /const heroImageSeed = ref\(0\)/.test(modal)
      && /heroImageSeed\.value = Math\.random\(\)/.test(modal)
      && /Math\.floor\(heroImageSeed\.value \* heroImageCandidates\.value\.length\)/.test(modal),
  },
  {
    name: 'Missing or broken hero images fall back without using cropped poster hero',
    pass: /modal-hero-fallback/.test(modal)
      && /hideBrokenHeroImage/.test(modal)
      && /brokenHeroImageUrls/.test(modal)
      && /aria-hidden="true"/.test(modal),
  },
  {
    name: 'Mobile layout uses full-width horizontal hero plus floating portrait poster',
    pass: /@media \(max-width: 560px\)/.test(modal)
      && /\.modal-hero \{[\s\S]*?width: calc\(100% \+ 32px\);/.test(modal)
      && /\.modal-poster \{[\s\S]*?width: 108px;[\s\S]*?margin-top: -58px;/.test(modal),
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
  console.error(`\n${failed} Sprint 17 QA check(s) failed.`);
  process.exit(1);
}

console.log('\nSprint 17 imagery hierarchy QA checks passed.');
