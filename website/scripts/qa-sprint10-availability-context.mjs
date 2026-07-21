#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(resolve(root, path), 'utf8');

const constants = read('src/lib/availabilityContext.js');
const settings = read('src/components/SettingsView.vue');
const modal = read('src/components/MovieModal.vue');
const movieCard = read('src/components/MovieCard.vue');
const searchCard = read('src/components/SearchResultCard.vue');
const moviesJson = JSON.parse(read('public/movies.json'));

const movieKeys = new Set();
for (const movie of moviesJson.movies || []) {
  for (const key of Object.keys(movie)) movieKeys.add(key);
}

const checks = [
  {
    name: 'static provider catalog is Spain-only bitmask data with no country map',
    pass: moviesJson.providers
      && moviesJson.providerNames
      && movieKeys.has('prov')
      && !movieKeys.has('country')
      && !movieKeys.has('countries')
      && !movieKeys.has('watchProviders'),
  },
  {
    name: 'availability country/source copy has one shared source of truth',
    pass: /AVAILABILITY_COUNTRY/.test(constants)
      && /label: "Spain"/.test(constants)
      && /JustWatch via TMDB/.test(constants)
      && /AVAILABILITY_CONTEXT_COPY/.test(constants),
  },
  {
    name: 'Settings streaming shows fixed country before provider controls',
    pass: /availability-country/.test(settings)
      && /Availability country/.test(settings)
      && /availabilityCountry\.label/.test(settings)
      && /availabilityCountry\.status/.test(settings)
      && settings.indexOf('availability-country') < settings.indexOf('provider-grid'),
  },
  {
    name: 'movie modal attributes Where to watch to Spain and JustWatch/TMDB',
    pass: /Where to watch/.test(modal)
      && /availability-source/.test(modal)
      && /availabilityContextCopy/.test(modal)
      && /AVAILABILITY_CONTEXT_COPY/.test(modal),
  },
  {
    name: 'poster/search cards do not expose provider source or country labels',
    pass: !/JustWatch|TMDB|Availability in Spain|Country/.test(movieCard)
      && !/JustWatch|TMDB|Availability in Spain|Country/.test(searchCard),
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
  console.error(`\n${failed} Sprint 10 availability-context QA check(s) failed.`);
  process.exit(1);
}

console.log('\nSprint 10 availability-context QA checks passed.');
