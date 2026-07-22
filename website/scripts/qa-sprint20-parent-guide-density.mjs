#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const modal = readFileSync(resolve(root, 'src/components/MovieModal.vue'), 'utf8');
const packageJson = readFileSync(resolve(root, 'package.json'), 'utf8');

function cssBlock(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = modal.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`));
  return match?.[1] || '';
}

const matExtLinkBlock = cssBlock('.mat-ext-link');
const rowDetailBlock = cssBlock('.compatibility-row-detail');
const scoreCurrentBlock = cssBlock('.score-current');

const checks = [
  {
    name: 'extra detail loader falls back to canonical production enrichment for parent-guide tags',
    pass: /const EXTRA_DETAIL_SOURCES = \["\/extra\.json", "https:\/\/ohana\.tv\/extra\.json"\]/.test(modal)
      && /for \(const source of EXTRA_DETAIL_SOURCES\)/.test(modal)
      && /fetch\(source, \{ headers: \{ Accept: "application\/json" \} \}\)/.test(modal)
      && /contentType\.includes\("application\/json"\)/.test(modal),
  },
  {
    name: 'maturity category tags are restored from upstream extra-details tag keys',
    pass: /const TAG_KEYS = \{[\s\S]*sex: "SEXUAL_CONTENT"[\s\S]*violence: "VIOLENCE"[\s\S]*language: "PROFANITY"[\s\S]*drugs: "ALCOHOL_DRUGS"[\s\S]*\}/.test(modal)
      && /extraDetails\.value\?\.tags\?\.\[TAG_KEYS\[cat\.key\]\]/.test(modal)
      && /supportTags\.length/.test(modal)
      && /class="compatibility-tags"/.test(modal)
      && /:aria-label="`\$\{row\.label\} details`"/.test(modal),
  },
  {
    name: 'each parent-guide row uses one compact score/detail line after the progress bar',
    pass: /class="compatibility-row-meter"[\s\S]*class="compatibility-row-detail"/.test(modal)
      && /display: flex;/.test(rowDetailBlock)
      && /justify-content: space-between;/.test(rowDetailBlock)
      && !/display: grid;/.test(rowDetailBlock),
  },
  {
    name: 'numeric score keeps one-decimal display and remains visually prominent',
    pass: /scoreCurrent: hasMovieScore \? formatScore\(rawScore\) : null/.test(modal)
      && /function formatScore\(raw\)[\s\S]*return raw\.toFixed\(1\)/.test(modal)
      && /class="score-fraction"/.test(modal)
      && /font-size: 20px;/.test(scoreCurrentBlock),
  },
  {
    name: 'IMDb guide and Common Sense Media controls are text links, not chips',
    pass: /class="mat-ext-link"/.test(modal)
      && /IMDb guide/.test(modal)
      && />CSM</.test(modal)
      && /color: #7dd3fc;/.test(matExtLinkBlock)
      && /text-decoration: underline;/.test(matExtLinkBlock)
      && /border-radius: 4px;/.test(matExtLinkBlock)
      && !/border: 1px solid/.test(matExtLinkBlock)
      && !/border-radius: 99px/.test(matExtLinkBlock),
  },
  {
    name: 'package exposes sprint 20 QA command',
    pass: /"qa:sprint20": "node scripts\/qa-sprint20-parent-guide-density\.mjs"/.test(packageJson),
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
  console.error(`\n${failed} sprint 20 QA check(s) failed.`);
  process.exit(1);
}

console.log('\nSprint 20 parent-guide tag/density QA checks passed.');
