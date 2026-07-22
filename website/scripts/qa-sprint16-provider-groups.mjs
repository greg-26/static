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
    name: 'API normalization exposes TMDB-style provider groups and region',
    pass: /function normalizeProviderGroups\(streamingProviders\)/.test(api)
      && /PROVIDER_GROUP_LABELS/.test(api)
      && /stream: "Stream"/.test(api)
      && /rent: "Rent"/.test(api)
      && /buy: "Buy"/.test(api)
      && /providerRegion: data\.streamingProviders\?\.region/.test(api)
      && /providerGroups: normalizeProviderGroups\(data\.streamingProviders\)/.test(api),
  },
  {
    name: 'Provider logos are normalized defensively from TMDB image sizes',
    pass: /function normalizeProvider\(provider, fallbackGroup\)/.test(api)
      && /logoUrl: bestImageUrl\(provider\.logo, \["thumbnail", "small", "medium", "original"\]\)/.test(api),
  },
  {
    name: 'Movie detail renders grouped API providers before static fallback',
    pass: /apiProviderGroups = computed\(\(\) => apiDetail\.value\?\.providerGroups \|\| \[\]\)/.test(modal)
      && /v-if="apiProviderGroups\.length" class="provider-groups"/.test(modal)
      && /v-for="group in apiProviderGroups"/.test(modal)
      && /v-else-if="providerNames\.length" class="provider-list" aria-label="Streaming availability"/.test(modal),
  },
  {
    name: 'Provider chips include icon fallback behavior and accessible text',
    pass: /provider-chip--with-logo/.test(modal)
      && /v-if="provider\.logoUrl"/.test(modal)
      && /@error="hideBrokenProviderLogo"/.test(modal)
      && /function hideBrokenProviderLogo\(event\)/.test(modal)
      && /<span>{{ provider\.name }}<\/span>/.test(modal),
  },
  {
    name: 'Custom provider searches remain separate from normal/API availability',
    pass: /aria-label="Custom provider searches"/.test(modal)
      && /Custom searches/.test(modal)
      && /provider-list--custom/.test(modal)
      && modal.indexOf('provider-groups') < modal.indexOf('provider-custom-row'),
  },
  {
    name: 'UX constants keep icons compact and rounded inside mobile-first chips',
    pass: /width: 28px;/.test(modal)
      && /height: 28px;/.test(modal)
      && /border-radius: 7px;/.test(modal)
      && /provider-group__label/.test(modal),
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
  console.error(`\n${failed} Sprint 16 QA check(s) failed.`);
  process.exit(1);
}

console.log('\nSprint 16 provider grouping QA checks passed.');
