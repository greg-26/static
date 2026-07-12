const BASE = "https://wqk4qyf5b3hpec5u4hiv7j3qiq0tlcpp.lambda-url.eu-west-1.on.aws/";
const LOCAL = false//["localhost", "127.0.0.1"].includes(window.location.hostname);

const LS_PREFIX = "ohanatv_kv_";

// Thrown when a conditional write (IfMatch/IfNoneMatch) is rejected by S3
// because the document changed (or already existed) since it was read.
// Distinct from a generic Error so callers/safeMutate can tell "someone
// else wrote first, retry" apart from a real failure.
export class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConflictError";
  }
}

export async function kvRead(token) {
  const { data } = await kvReadWithEtag(token);
  return data;
}

// Same as kvRead but also returns the object's current S3 etag, needed to
// make a conditional write against exactly the version you read.
export async function kvReadWithEtag(token) {
  if (LOCAL) {
    const raw = localStorage.getItem(LS_PREFIX + token);
    return raw ? { data: JSON.parse(raw), etag: null } : { data: null, etag: null };
  }
  const res = await fetch(`${BASE}read`, { headers: { "x-write-token": token } });
  if (res.status === 404) return { data: null, etag: null };
  if (!res.ok) throw new Error(`kvRead ${res.status}`);
  const etag = res.headers.get("x-etag");
  const data = await res.json();
  return { data, etag };
}

// opts:
//   ifMatch     — only write if the object's current etag still matches this
//                 (compare-and-swap against a doc you previously read)
//   ifNoneMatch — pass "*" to only write if no object exists yet (create-guard)
// Throws ConflictError (not a generic Error) on a 409, so callers can
// distinguish "lost the race, maybe retry" from a real failure.
export async function kvWrite(token, data, { ifMatch, ifNoneMatch } = {}) {
  if (LOCAL) {
    localStorage.setItem(LS_PREFIX + token, JSON.stringify(data));
    return;
  }
  const headers = { "x-write-token": token, "Content-Type": "application/json" };
  if (ifMatch)     headers["x-if-match"] = ifMatch;
  if (ifNoneMatch) headers["x-if-none-match"] = ifNoneMatch;

  const res = await fetch(`${BASE}write`, { method: "PUT", headers, body: JSON.stringify(data) });
  if (res.status === 409) throw new ConflictError("kvWrite: document changed since it was read");
  if (!res.ok) throw new Error(`kvWrite ${res.status}`);
}

export function generateToken() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => b.toString(16).padStart(2, "0")).join("");
}

// ── Field-level safe mutation ────────────────────────────────────────────
//
// Reads the freshest copy of the document right before writing (so a save
// can never clobber a field it didn't touch) AND writes conditionally on
// that exact version still being current (so two writers touching the SAME
// field can't silently stomp each other either — the loser gets a 409 and
// retries against the winner's data instead of overwriting it).

function addTo(arr, value) {
  const list = arr ?? [];
  return list.includes(value) ? list : [...list, value];
}

function removeFrom(arr, value) {
  return (arr ?? []).filter(x => x !== value);
}

function toggleIn(arr, value) {
  const list = arr ?? [];
  return list.includes(value) ? list.filter(x => x !== value) : [...list, value];
}

// Reads the doc, applies `mutatorFn(remoteDoc) -> newDoc`, and writes it
// back CONDITIONALLY on nothing else having changed it in between (real
// compare-and-swap, enforced by S3 — see store.js). If another writer wins
// the race, the write is rejected with a 409 rather than silently
// overwriting their change; this retries with fresh data instead of losing
// either side's update. Returns the written doc.
//
// Throws if the doc doesn't exist, rather than silently mutating an empty
// object — a spurious/transient 404 should never result in overwriting a
// real document with one that's missing every other field. Pass
// `{ allowMissing: true }` only for call sites that genuinely mean
// "create this if it isn't there yet" (uses IfNoneMatch so a concurrent
// create can't be clobbered either).
export async function safeMutate(token, mutatorFn, { allowMissing = false, retries = 4 } = {}) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const { data: remote, etag } = await kvReadWithEtag(token);
    if (remote === null && !allowMissing) {
      throw new Error("safeMutate: no document found for this token");
    }
    const updated = mutatorFn(remote ?? {});
    try {
      if (remote === null) {
        await kvWrite(token, updated, { ifNoneMatch: "*" });
      } else {
        await kvWrite(token, updated, { ifMatch: etag });
      }
      return updated;
    } catch (err) {
      const isLastAttempt = attempt === retries;
      if (err instanceof ConflictError && !isLastAttempt) {
        // Someone else wrote first — small backoff, then re-read and reapply
        // mutatorFn against their result instead of ours.
        await new Promise(r => setTimeout(r, 50 * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
}

export function safeAdd(token, field, value, opts) {
  return safeMutate(token, doc => ({ ...doc, [field]: addTo(doc[field], value) }), opts);
}

export function safeRemove(token, field, value, opts) {
  return safeMutate(token, doc => ({ ...doc, [field]: removeFrom(doc[field], value) }), opts);
}

export function safeToggle(token, field, value, opts) {
  return safeMutate(token, doc => ({ ...doc, [field]: toggleIn(doc[field], value) }), opts);
}

export function safeReplace(token, field, value, opts) {
  return safeMutate(token, doc => ({ ...doc, [field]: value }), opts);
}