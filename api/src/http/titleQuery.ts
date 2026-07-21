import type { TitleCacheMode } from "../cache/titleCache";
import { areCacheOverridesAllowed, isProductionEnvironment } from "../cache/titleCache";
import type { ApiEnv } from "../config/env";
import { errorResponse } from "./errors";

export interface TitleRequestContext {
  cacheMode: TitleCacheMode;
  language?: string;
  country?: string;
}

export type ParsedTitleQuery = { ok: true; context: TitleRequestContext } | { ok: false; response: Response };

export function parseTitleQuery(url: URL, env: ApiEnv): ParsedTitleQuery {
  const cacheMode = parseCacheMode(url, env);
  if (!cacheMode.ok) return cacheMode;

  const language = parseLanguage(url.searchParams.get("lang"));
  if (!language.ok) return { ok: false, response: errorResponse("invalid_language", "Invalid language parameter.", 400) };

  const country = parseCountry(url.searchParams.get("country"));
  if (!country.ok) return { ok: false, response: errorResponse("invalid_country", "Invalid country parameter.", 400) };

  return {
    ok: true,
    context: {
      cacheMode: cacheMode.mode,
      ...(language.value === undefined ? {} : { language: language.value }),
      ...(country.value === undefined ? {} : { country: country.value }),
    },
  };
}

function parseCacheMode(url: URL, env: ApiEnv): { ok: true; mode: TitleCacheMode } | { ok: false; response: Response } {
  const value = url.searchParams.get("cache");
  const mode = value === null || value === "" ? "normal" : value;

  if (mode !== "normal" && mode !== "refresh" && mode !== "bypass") {
    return { ok: false, response: errorResponse("invalid_cache_mode", "Invalid cache mode.", 400) };
  }

  if ((mode === "refresh" || mode === "bypass") && isProductionEnvironment(env.ENVIRONMENT) && !areCacheOverridesAllowed(env.ALLOW_CACHE_OVERRIDES)) {
    return { ok: false, response: errorResponse("cache_mode_not_allowed", "Cache override mode is not allowed.", 400) };
  }

  return { ok: true, mode };
}

function parseLanguage(value: string | null): { ok: true; value?: string } | { ok: false } {
  if (value === null) return { ok: true };
  const normalized = value.trim().replace("_", "-");
  const match = /^([a-zA-Z]{2})(?:-([a-zA-Z]{2}))?$/.exec(normalized);
  if (!match) return { ok: false };

  const language = match[1]?.toLowerCase();
  const region = match[2]?.toUpperCase();
  return { ok: true, value: region === undefined ? language : `${language}-${region}` };
}

function parseCountry(value: string | null): { ok: true; value?: string } | { ok: false } {
  if (value === null) return { ok: true };
  const normalized = value.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(normalized) ? { ok: true, value: normalized } : { ok: false };
}
