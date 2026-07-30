#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const modal = readFileSync(resolve(root, 'src/components/MovieModal.vue'), 'utf8');
const packageJson = readFileSync(resolve(root, 'package.json'), 'utf8');

function extractFunction(name) {
  const marker = `function ${name}`;
  const start = modal.indexOf(marker);
  if (start === -1) return '';
  const open = modal.indexOf('{', start);
  let depth = 0;
  for (let i = open; i < modal.length; i += 1) {
    if (modal[i] === '{') depth += 1;
    if (modal[i] === '}') depth -= 1;
    if (depth === 0) return modal.slice(start, i + 1);
  }
  return '';
}

const shareMovie = extractFunction('shareMovie');
const canUseNativeShare = extractFunction('canUseNativeShare');

const checks = [
  {
    name: 'share button keeps native Web Share API as the first share path',
    pass: /typeof navigator\.share !== "function"/.test(canUseNativeShare)
      && /navigator\.canShare\(shareData\) === true/.test(canUseNativeShare)
      && shareMovie.indexOf('await navigator.share(shareData)') !== -1
      && shareMovie.indexOf('await navigator.share(shareData)') < shareMovie.indexOf('fallbackToMovieLink(url)')
      && /setShareFeedback\("Shared"\)/.test(shareMovie),
  },
  {
    name: 'native share failures fall back to the exact movie link instead of stopping at unavailable',
    pass: /Fall back to copying the exact movie link when native sharing fails\.[\s\S]*if \(await fallbackToMovieLink\(url\)\) return;/.test(modal),
  },
  {
    name: 'fallback copies direct movie links with Clipboard API and gesture-driven execCommand fallback',
    pass: /async function copyMovieShareLink\(url\)/.test(modal)
      && /navigator\.clipboard\?\.writeText/.test(modal)
      && /document\.execCommand\?\.\("copy"\)/.test(modal),
  },
  {
    name: 'manual prompt is the last useful fallback before truly unavailable feedback',
    pass: /function showManualShareLink\(url\)[\s\S]*window\.prompt\("Copy movie link", url\)/.test(modal)
      && /setShareFeedback\("Copy link manually"\)/.test(modal)
      && !/Copy unavailable/.test(modal),
  },
  {
    name: 'unavailable feedback only appears after native share, copy, and manual link fallback fail',
    pass: /if \(await fallbackToMovieLink\(url\)\) return;\s*setShareFeedback\("Share unavailable"\);/.test(modal),
  },
  {
    name: 'package exposes issue 44 QA command',
    pass: /"qa:issue44": "node scripts\/qa-issue44-share-cx\.mjs"/.test(packageJson),
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
  console.error(`\n${failed} issue 44 QA check(s) failed.`);
  process.exit(1);
}

console.log('\nIssue 44 share CX QA checks passed.');
