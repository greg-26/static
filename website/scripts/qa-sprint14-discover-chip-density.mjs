#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(resolve(root, path), 'utf8');

const hero = read('src/components/HeroSection.vue');
const packageJson = JSON.parse(read('package.json'));

const headingBlocks = [...hero.matchAll(/<div class="filter-heading">[\s\S]*?<\/div>/g)].map(match => match[0]);

const checks = [
  {
    name: 'Discover filter headings no longer render subtitle/helper spans',
    pass: headingBlocks.length >= 4 && headingBlocks.every(block => !/<span[\s>]/.test(block)),
  },
  {
    name: 'maturity dropdown options render labels only, without profile descriptions',
    pass: /v-for="profile in maturityProfiles"[\s\S]*<span>{{ profile\.label }}<\/span>/.test(hero)
      && !/{{ profile\.description }}/.test(hero)
      && !/<small>{{ profile\.description }}<\/small>/.test(hero),
  },
  {
    name: 'profile option styling is compact and single-line after subtitle removal',
    pass: /\.menu-option--profile\s*\{[\s\S]*min-height: 40px[\s\S]*max-width: 180px/.test(hero)
      && /\.menu-option--profile span\s*\{[\s\S]*text-overflow: ellipsis[\s\S]*white-space: nowrap/.test(hero)
      && !/\.menu-option--profile small/.test(hero),
  },
  {
    name: 'dropdown option labels and actions are preserved',
    pass: /Flatrate/.test(hero)
      && /Free with ads/.test(hero)
      && /Rent/.test(hero)
      && /Buy/.test(hero)
      && /Any/.test(hero)
      && /v-for="genre in GENRE_LABELS"/.test(hero)
      && /@click="selectMaturityProfile\(profile\)"/.test(hero)
      && /@click="selectGenre\(genre\)"/.test(hero)
      && /@click="selectAvailability\('my-services'\)"/.test(hero),
  },
  {
    name: 'QA script is wired into package scripts',
    pass: packageJson.scripts?.['qa:sprint14'] === 'node scripts/qa-sprint14-discover-chip-density.mjs',
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
  console.error(`\n${failed} Sprint 14 Discover chip density QA check(s) failed.`);
  process.exit(1);
}

console.log('\nSprint 14 Discover chip density QA checks passed.');
