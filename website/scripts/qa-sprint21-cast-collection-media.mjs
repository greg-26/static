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

const castPersonBlock = cssBlock('.api-cast-person');
const collectionItemBlock = cssBlock('.api-collection-item');
const collectionPosterBlock = cssBlock('.api-collection-item img,\n.api-collection-poster-fallback');

const checks = [
  {
    name: 'API normalizer exposes cast profileUrl from profile image sizes',
    pass: /profileUrl: bestImageUrl\(member\.profile, \["small", "thumbnail", "medium", "original"\]\)/.test(api),
  },
  {
    name: 'cast cards render profile photos with lazy loading, explicit dimensions, and error fallback tracking',
    pass: /person\.profileUrl && !brokenCastProfileUrls\.has\(person\.profileUrl\)/.test(modal)
      && /:src="person\.profileUrl"/.test(modal)
      && /width="44"/.test(modal)
      && /height="60"/.test(modal)
      && /loading="lazy"/.test(modal)
      && /@error="hideBrokenCastProfile"/.test(modal)
      && /function hideBrokenCastProfile\(event\)/.test(modal),
  },
  {
    name: 'missing cast photos fall back to stable initials without broken image boxes',
    pass: /<span v-else>\{\{ castInitials\(person\.name\) \}\}<\/span>/.test(modal)
      && /function castInitials\(name\)/.test(modal)
      && /brokenCastProfileUrls\.value = new Set\(\)/.test(modal),
  },
  {
    name: 'cast layout preserves mobile truncation and compact media/name hierarchy',
    pass: /grid-template-columns: 44px minmax\(0, 1fr\);/.test(castPersonBlock)
      && /\.api-cast-avatar,\n\.api-cast-avatar img \{[\s\S]*width: 44px;[\s\S]*height: 60px;/.test(modal)
      && /\.api-cast-copy,[\s\S]*white-space: nowrap;/.test(modal)
      && /\.api-cast-list \{ grid-template-columns: 1fr; \}/.test(modal),
  },
  {
    name: 'collection posters are larger portrait media with graceful broken-image fallback',
    pass: /item\.posterUrl && !brokenCollectionPosterUrls\.has\(item\.posterUrl\)/.test(modal)
      && /width="96"/.test(modal)
      && /height="144"/.test(modal)
      && /@error="hideBrokenCollectionPoster"/.test(modal)
      && /function hideBrokenCollectionPoster\(event\)/.test(modal)
      && /width: 96px;/.test(collectionPosterBlock)
      && /aspect-ratio: 2 \/ 3;/.test(collectionPosterBlock)
      && /object-fit: cover;/.test(collectionPosterBlock),
  },
  {
    name: 'collection remains horizontally scrollable with comfortable larger poster cards',
    pass: /display: flex;/.test(cssBlock('.api-collection-list'))
      && /overflow-x: auto;/.test(cssBlock('.api-collection-list'))
      && /flex: 0 0 104px;/.test(collectionItemBlock)
      && /scroll-snap-align: start;/.test(collectionItemBlock)
      && /\.api-collection-item \{ flex-basis: 100px; \}/.test(modal),
  },
  {
    name: 'cast and collection sections remain after providers and before seasons/user actions',
    pass: /class="modal-providers"[\s\S]*api-collection-label[\s\S]*api-seasons-label[\s\S]*api-cast-label[\s\S]*modal-user-actions/.test(modal),
  },
  {
    name: 'package exposes sprint 21 QA command',
    pass: /"qa:sprint21": "node scripts\/qa-sprint21-cast-collection-media\.mjs"/.test(packageJson),
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
  console.error(`\n${failed} sprint 21 QA check(s) failed.`);
  process.exit(1);
}

console.log('\nSprint 21 cast/collection media QA checks passed.');
