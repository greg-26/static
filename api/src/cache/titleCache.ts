import type { TitleResponse } from "../models/title";

export const TITLE_CACHE_SCHEMA_VERSION = "v1";
export const DEFAULT_TITLE_CACHE_TTL_SECONDS = 7 * 24 * 60 * 60;

export type TitleCacheMode = "normal" | "refresh" | "bypass";

export interface TitleCacheBinding {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

interface TitleCacheEnvelope {
  storedAt: number;
  ttlSeconds: number;
  title: TitleResponse;
}

export function titleCacheKey(imdbId: string): string {
  return `title:${imdbId}:${TITLE_CACHE_SCHEMA_VERSION}`;
}

export function parseTitleCacheTtlSeconds(value: string | undefined): number {
  if (value === undefined || value.trim() === "") return DEFAULT_TITLE_CACHE_TTL_SECONDS;

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : DEFAULT_TITLE_CACHE_TTL_SECONDS;
}

export function isProductionEnvironment(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === "production";
}

export function areCacheOverridesAllowed(value: string | undefined): boolean {
  return ["1", "true", "yes"].includes(value?.trim().toLowerCase() ?? "");
}

function encodeEnvelope(title: TitleResponse, ttlSeconds: number, now: number): string {
  return JSON.stringify({ storedAt: now, ttlSeconds, title } satisfies TitleCacheEnvelope);
}

function decodeEnvelope(raw: string, now: number): TitleResponse | null {
  try {
    const value = JSON.parse(raw) as Partial<TitleCacheEnvelope>;

    if (typeof value.storedAt !== "number" || typeof value.ttlSeconds !== "number" || value.ttlSeconds <= 0 || typeof value.title !== "object" || value.title === null) {
      return null;
    }

    if (now - value.storedAt > value.ttlSeconds * 1000) {
      return null;
    }

    return value.title as TitleResponse;
  } catch {
    return null;
  }
}

export async function readCachedTitle(cache: TitleCacheBinding | undefined, imdbId: string, now = Date.now()): Promise<TitleResponse | null> {
  if (!cache) return null;

  const raw = await cache.get(titleCacheKey(imdbId));
  return raw === null ? null : decodeEnvelope(raw, now);
}

export async function writeCachedTitle(cache: TitleCacheBinding | undefined, imdbId: string, title: TitleResponse, ttlSeconds: number, now = Date.now()): Promise<void> {
  if (!cache) return;

  const options = ttlSeconds >= 60 ? { expirationTtl: ttlSeconds } : undefined;
  await cache.put(titleCacheKey(imdbId), encodeEnvelope(title, ttlSeconds, now), options);
}
