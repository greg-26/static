import type { TitleResponse } from "../models/title";

export const TITLE_CACHE_SCHEMA_VERSION = "v3";
export const DEFAULT_TITLE_CACHE_TTL_SECONDS = 7 * 24 * 60 * 60;

export type TitleCacheMode = "normal" | "refresh" | "bypass";

export interface TitleCacheVariant {
  language?: string;
  country?: string;
}

export interface TitleCacheBinding {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

interface TitleCacheEnvelope {
  storedAt: number;
  ttlSeconds: number;
  title: TitleResponse;
}

export type CachedTitleReadResult =
  | { status: "fresh"; title: TitleResponse }
  | { status: "stale"; title: TitleResponse }
  | { status: "miss" };

export function titleCacheKey(imdbId: string, variant: TitleCacheVariant = {}): string {
  const parts = [`title:${imdbId}:${TITLE_CACHE_SCHEMA_VERSION}`];
  if (variant.language) parts.push(`lang=${variant.language}`);
  if (variant.country) parts.push(`country=${variant.country}`);
  return parts.join(":");
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

function decodeEnvelope(raw: string, now: number): CachedTitleReadResult {
  try {
    const value = JSON.parse(raw) as Partial<TitleCacheEnvelope>;

    if (typeof value.storedAt !== "number" || typeof value.ttlSeconds !== "number" || value.ttlSeconds <= 0 || typeof value.title !== "object" || value.title === null) {
      return { status: "miss" };
    }

    if (now - value.storedAt > value.ttlSeconds * 1000) {
      return { status: "stale", title: value.title as TitleResponse };
    }

    return { status: "fresh", title: value.title as TitleResponse };
  } catch {
    return { status: "miss" };
  }
}

export async function readCachedTitleState(cache: TitleCacheBinding | undefined, imdbId: string, variant: TitleCacheVariant = {}, now = Date.now()): Promise<CachedTitleReadResult> {
  if (!cache) return { status: "miss" };

  const raw = await cache.get(titleCacheKey(imdbId, variant));
  return raw === null ? { status: "miss" } : decodeEnvelope(raw, now);
}

export async function readCachedTitle(cache: TitleCacheBinding | undefined, imdbId: string, variant: TitleCacheVariant = {}, now = Date.now()): Promise<TitleResponse | null> {
  const result = await readCachedTitleState(cache, imdbId, variant, now);
  return result.status === "fresh" ? result.title : null;
}

export async function writeCachedTitle(
  cache: TitleCacheBinding | undefined,
  imdbId: string,
  title: TitleResponse,
  ttlSeconds: number,
  variant: TitleCacheVariant = {},
  now = Date.now(),
): Promise<void> {
  if (!cache) return;

  const options = ttlSeconds >= 60 ? { expirationTtl: ttlSeconds } : undefined;
  await cache.put(titleCacheKey(imdbId, variant), encodeEnvelope(title, ttlSeconds, now), options);
}
