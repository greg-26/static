/**
 * maturity.js — Web UI client utility layer
 * ------------------------------------------
 * Encodes, decodes, and translates precompiled 16-bit packed data nibbles.
 * Zero external dependencies or heavy file system access layers.
 */

/** 4 CSM categories stored as 4-bit nibbles in a 16-bit matMask. */
export const MATURITY_CATEGORIES = [
  { key: "sex",      label: "Sex & Nudity", shift: 0  },
  { key: "violence", label: "Violence",     shift: 4  },
  { key: "language", label: "Language",     shift: 8  },
  { key: "drugs",    label: "Drugs",        shift: 12 },
];

/** Labels for integer scores 0–5 (matching CSM scale). */
export const SEVERITY_LABELS = ["None", "Minimal", "Mild", "Moderate", "Strong", "Severe"];

/** CSS color class assignment handler matching application styles */
export function scoreCssClass(score) {
  const s = Math.round(Math.max(0, Math.min(5, score)));
  return `sev-${s}`.toLowerCase();
}

/** Extract the 0–5 float score for a category from a 16-bit matMask. */
export function getScore(matMask, shift) {
  return decodeNibble((matMask >>> shift) & 0xf);
}

/** Decode a 4-bit nibble layout into an application float score */
export function decodeNibble(nibble) {
  if (!nibble && nibble !== 0) return NaN
  const value = Math.min(15, Math.max(0, nibble & 0xf));
  if (value == 15) return NaN
  return value / 3
}

/** Read a 16-bit packed matMask back into distinct human-readable score metrics */
export function decodeMatMask(matMask) {
  const m = matMask >>> 0;
  return {
    sex:       decodeNibble((m >> 0)  & 0xf),
    violence:  decodeNibble((m >> 4)  & 0xf),
    language:  decodeNibble((m >> 8)  & 0xf),
    drugs:     decodeNibble((m >> 12) & 0xf),
  };
}



function encodeNibble(value) {
  if (value === null || value === undefined || typeof value !== 'number') return 15;
  const clamped = Math.max(0, Math.min(5, value));
  const rounded = Math.round(clamped * 3);
  return Math.min(14, Math.max(0, rounded));
}

function packMatMask(sex, violence, language, drugs) {
  return (
    (encodeNibble(sex)      <<  0) |
    (encodeNibble(violence) <<  4) |
    (encodeNibble(language) <<  8) |
    (encodeNibble(drugs)    << 12)
  );
}

export function computeMatMask(cache) {
  const numVotes = cache?.rawParentsGuide?.[0]?.severityBreakdowns?.reduce((s, b) => s + b.voteCount, 0)
  if (!numVotes || numVotes < 5){
    if(resolveProbs(cache?.preds?.csm_sex)) console.log('Variance is ok, but not enought votes ', numVotes, ' -> Should probably discard ', cache?.preds)
    //return packMatMask()
  }
  //console.log('Now yess enought votes ', numVotes, ' -> Using ', cache?.preds)
  return packMatMask(
    resolveProbs(cache?.preds?.csm_sex),
    resolveProbs(cache?.preds?.csm_violence),
    resolveProbs(cache?.preds?.csm_language),
    resolveProbs(cache?.preds?.csm_drugs)
  );
}

function resolveProbs(pred) {
  if (!pred?.probs) return;
  const { mode, probs } = pred;

  if (mode === 'ev') {
    return Math.round(probs.reduce((acc, p, i) => acc + p * i, 0));
  }

  // argmax with ±0.33 nudge
  const mean = probs.reduce((acc, p, i) => acc + p * i, 0);
  const varNorm = probs.reduce((acc, p, i) => acc + p * (i - mean) ** 2, 0);

  const sorted = probs.map((p, i) => ({ p, i })).sort((a, b) => b.p - a.p);
  const best = sorted[0].i;
  const second = sorted[1].i;
  const margin = sorted[0].p - sorted[1].p;

  if (varNorm > 1.25){
    //console.log('variance tooo high ', probs)
    return;
  } 
  if (margin < 0.25) return Math.round((best + Math.sign(second - best) * 0.33) * 100) / 100;
  return best;
}
