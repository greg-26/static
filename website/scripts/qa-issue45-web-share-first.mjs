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

function order(haystack, first, second) {
  const a = haystack.indexOf(first);
  const b = haystack.indexOf(second);
  return a !== -1 && b !== -1 && a < b;
}

const shareMovie = extractFunction('shareMovie');
const canUseNativeShare = extractFunction('canUseNativeShare');
const isUserCancelledNativeShare = extractFunction('isUserCancelledNativeShare');

const checks = [
  {
    name: 'shareMovie attempts navigator.share(shareData) before any copy/manual fallback',
    pass: order(shareMovie, 'await navigator.share(shareData)', 'fallbackToMovieLink(url)')
      && !/copyMovieShareLink|navigator\.clipboard|execCommand|showManualShareLink/.test(
        shareMovie.slice(0, shareMovie.indexOf('await navigator.share(shareData)')),
      ),
  },
  {
    name: 'native Web Share capability gates on navigator.share first, not clipboard availability',
    pass: /typeof navigator\.share === "function"/.test(canUseNativeShare)
      && !/clipboard|copyMovieShareLink|execCommand/.test(canUseNativeShare),
  },
  {
    name: 'navigator.canShare does not gate URL shares when navigator.share exists',
    pass: !/canShare/.test(canUseNativeShare),
  },
  {
    name: 'copy fallback runs only when native share is unavailable, unshareable, or non-cancel failure',
    pass: /if \(canUseNativeShare\(\)\)/.test(shareMovie)
      && /catch \(error\)[\s\S]*isUserCancelledNativeShare\(error\)[\s\S]*return;[\s\S]*Fall back to copying the exact movie link/.test(shareMovie)
      && /if \(await fallbackToMovieLink\(url\)\) return;/.test(shareMovie),
  },
  {
    name: 'user-cancelled native share exits quietly without copied/error feedback',
    pass: /error\?\.name === "AbortError"/.test(isUserCancelledNativeShare)
      && /NotAllowedError/.test(isUserCancelledNativeShare)
      && order(shareMovie, 'if (isUserCancelledNativeShare(error)) return;', 'fallbackToMovieLink(url)'),
  },
  {
    name: 'package exposes issue 45 QA command',
    pass: /"qa:issue45": "node scripts\/qa-issue45-web-share-first\.mjs"/.test(packageJson),
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
  console.error(`\n${failed} issue 45 QA check(s) failed.`);
  process.exit(1);
}

console.log('\nIssue 45 Web Share API QA checks passed.');
