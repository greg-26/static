#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(resolve(root, path), 'utf8');

const settings = read('src/components/SettingsView.vue');
const modal = read('src/components/MovieModal.vue');
const customProviders = read('src/lib/customProviders.js');

const checks = [
  {
    name: 'Settings streaming owns custom provider add/manage UI',
    pass: /Custom search providers/.test(settings)
      && /newCustomProvider/.test(settings)
      && /userStore\.addCustomProvider\(template\)/.test(settings)
      && /userStore\.removeCustomProvider\(provider\.urlTemplate\)/.test(settings)
      && /resolveCustomProviders\(userStore\.userData\?\.customProviders \?\? \[\]\)/.test(settings),
  },
  {
    name: 'Movie detail no longer exposes custom provider add/remove configuration controls',
    pass: !/showProviderForm|providerInput|commitProvider|provider-chip--add|custom-provider-add|provider-chip-remove|removeCustomProvider/.test(modal),
  },
  {
    name: 'Movie detail separates normal provider availability from custom searches',
    pass: /aria-label="Streaming availability"/.test(modal)
      && /aria-label="Custom provider searches"/.test(modal)
      && /provider-custom-row__label/.test(modal)
      && /Custom searches/.test(modal)
      && /provider-list--custom/.test(modal),
  },
  {
    name: 'Custom provider parsing and movie URL templating are shared by Settings and detail',
    pass: /export function extractCustomProviderDomain/.test(customProviders)
      && /export function fillCustomProviderUrl/.test(customProviders)
      && /export function resolveCustomProviders/.test(customProviders)
      && /title\\\}/.test(customProviders)
      && /year\\\}/.test(customProviders)
      && /imdb\\\}/.test(customProviders)
      && /resolveCustomProviders/.test(settings)
      && /resolveCustomProviders/.test(modal),
  },
  {
    name: 'Sprint 010 availability source and Settings path remain adjacent to provider display',
    pass: /availabilityContextCopy/.test(modal)
      && /RouterLink v-if="availabilityDetail\.action" to="\/settings\/streaming"/.test(modal)
      && /availability-country/.test(settings)
      && settings.indexOf('availability-country') < settings.indexOf('provider-grid'),
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
  console.error(`\n${failed} Sprint 15 QA check(s) failed.`);
  process.exit(1);
}

console.log('\nSprint 15 provider settings QA checks passed.');
