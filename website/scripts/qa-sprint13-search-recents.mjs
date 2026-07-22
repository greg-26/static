#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(resolve(root, path), 'utf8');

const searchView = read('src/components/SearchView.vue');
const searchBox = read('src/components/SearchBox.vue');
const searchCard = read('src/components/SearchResultCard.vue');
const packageJson = JSON.parse(read('package.json'));

const checks = [
  {
    name: 'recent searches render as a focus-gated input-attached suggestion list, not permanent chips',
    pass: /showRecentSearchSuggestions/.test(searchView)
      && /searchFocusWithin/.test(searchView)
      && /recentSearchSuggestionsDismissed/.test(searchView)
      && /id="recent-search-suggestions"/.test(searchView)
      && /role="listbox"/.test(searchView)
      && !/recent-chips|<UiChip/.test(searchView),
  },
  {
    name: 'suggestion selection commits route-backed search and refreshes recent activity',
    pass: /function runRecentSearch\(query\)/.test(searchView)
      && /localSearch\.value = query/.test(searchView)
      && /store\.searchQuery = query/.test(searchView)
      && /syncSearchQueryToRoute\(query\)/.test(searchView)
      && /addRecentSearch\(query\)/.test(searchView),
  },
  {
    name: 'Escape and blur dismiss suggestions without committing a query',
    pass: /@keydown\.escape="dismissRecentSearchSuggestions"/.test(searchView)
      && /handleSearchFocusOut/.test(searchView)
      && /event\.currentTarget\.contains\(event\.relatedTarget\)/.test(searchView)
      && /recentSearchSuggestionsDismissed\.value = true/.test(searchView),
  },
  {
    name: 'SearchBox exposes combobox-adjacent ARIA and Escape/focus hooks',
    pass: /:aria-controls="ariaControls \|\| undefined"/.test(searchBox)
      && /:aria-expanded="ariaExpanded"/.test(searchBox)
      && /:aria-autocomplete="ariaAutocomplete \|\| undefined"/.test(searchBox)
      && /@keydown\.escape="emit\('escape'/.test(searchBox)
      && /"focus"/.test(searchBox)
      && /"blur"/.test(searchBox),
  },
  {
    name: 'search result row and poster share the same radius token',
    pass: /--search-card-radius: 12px/.test(searchCard)
      && /\.search-card[\s\S]*border-radius: var\(--search-card-radius\)/.test(searchCard)
      && /\.poster[\s\S]*border-radius: var\(--search-card-radius\)/.test(searchCard),
  },
  {
    name: 'QA script is wired into package scripts',
    pass: packageJson.scripts?.['qa:sprint13'] === 'node scripts/qa-sprint13-search-recents.mjs',
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
  console.error(`\n${failed} Sprint 13 search-recents QA check(s) failed.`);
  process.exit(1);
}

console.log('\nSprint 13 search-recents QA checks passed.');
