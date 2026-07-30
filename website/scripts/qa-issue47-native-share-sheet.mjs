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

function before(haystack, first, second) {
  const a = haystack.indexOf(first);
  const b = haystack.indexOf(second);
  return a !== -1 && b !== -1 && a < b;
}

const shareMovie = extractFunction('shareMovie');
const canUseNativeShare = extractFunction('canUseNativeShare');
const isUserCancelledNativeShare = extractFunction('isUserCancelledNativeShare');

const checks = [
  {
    name: 'native share detection only requires navigator.share support',
    pass: /typeof navigator !== "undefined"/.test(canUseNativeShare)
      && /typeof navigator\.share === "function"/.test(canUseNativeShare)
      && !/canShare|clipboard|execCommand/.test(canUseNativeShare),
  },
  {
    name: 'share payload is the simple title + URL shape for widest mobile support',
    pass: /const shareData = \{ title, url \};/.test(shareMovie)
      && !/text:/.test(shareMovie),
  },
  {
    name: 'navigator.share is attempted before any clipboard or prompt fallback',
    pass: before(shareMovie, 'await navigator.share(shareData)', 'fallbackToMovieLink(url)')
      && !/copyMovieShareLink|navigator\.clipboard|execCommand|showManualShareLink/.test(
        shareMovie.slice(0, shareMovie.indexOf('await navigator.share(shareData)')),
      ),
  },
  {
    name: 'native share success and cancel both leave fallback status copy silent',
    pass: !/setShareFeedback\("Shared"\)/.test(shareMovie)
      && /if \(isUserCancelledNativeShare\(error\)\) return;/.test(shareMovie)
      && before(shareMovie, 'if (isUserCancelledNativeShare(error)) return;', 'fallbackToMovieLink(url)'),
  },
  {
    name: 'unsupported or non-cancel native failures keep link fallback available',
    pass: /if \(await fallbackToMovieLink\(url\)\) return;\s*setShareFeedback\("Share unavailable"\);/.test(shareMovie)
      && /setShareFeedback\("Link copied"\)/.test(modal)
      && /window\.prompt\("Copy movie link", url\)/.test(modal),
  },
  {
    name: 'fallback feedback lives in the same modal-share-action cluster as the icon button',
    pass: /<div v-if="movie\.id" class="modal-share-action">[\s\S]*<p v-if="shareFeedback" class="modal-share-feedback"[\s\S]*<button[\s\S]*class="modal-share-button"/.test(modal)
      && /\.modal-share-action \{[\s\S]*display: inline-flex/.test(modal)
      && /\.modal-share-action \{[\s\S]*position: fixed;[\s\S]*right: 12px/.test(modal),
  },
  {
    name: 'share button remains accessible and keyboard focus-visible',
    pass: /:aria-label="`Share \$\{movie\.t\}`"/.test(modal)
      && /<span class="sr-only">Share movie<\/span>/.test(modal)
      && /\.modal-share-button:focus-visible/.test(modal),
  },
  {
    name: 'package exposes issue 47 QA command',
    pass: /"qa:issue47": "node scripts\/qa-issue47-native-share-sheet\.mjs"/.test(packageJson),
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
  console.error(`\n${failed} issue 47 QA check(s) failed.`);
  process.exit(1);
}

console.log('\nIssue 47 native share sheet QA checks passed.');
