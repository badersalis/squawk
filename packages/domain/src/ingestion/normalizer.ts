import type { Location } from '../shared/location.js';
import { locationFromRaw } from '../shared/location.js';
import type {
  EmploymentType,
  Seniority,
  WorkMode,
} from '../job/job.enums.js';
import {
  COUNTRY_NAME_TO_CODE,
  EMPLOYMENT_TYPE_RULES,
  SENIORITY_RULES,
  WORK_MODE_RULES,
} from './normalizer.rules.js';

// ---------------------------------------------------------------------------
// Work mode
// ---------------------------------------------------------------------------

export function normalizeWorkMode(raw?: string | null): WorkMode {
  if (!raw) return 'UNKNOWN';
  const value = raw.trim();
  if (!value) return 'UNKNOWN';
  for (const [re, mode] of WORK_MODE_RULES) {
    if (re.test(value)) return mode;
  }
  return 'UNKNOWN';
}

// ---------------------------------------------------------------------------
// Employment type
// ---------------------------------------------------------------------------

export function normalizeEmploymentType(raw?: string | null): EmploymentType {
  if (!raw) return 'UNKNOWN';
  const value = raw.trim();
  if (!value) return 'UNKNOWN';
  for (const [re, type] of EMPLOYMENT_TYPE_RULES) {
    if (re.test(value)) return type;
  }
  return 'UNKNOWN';
}

// ---------------------------------------------------------------------------
// Seniority
// ---------------------------------------------------------------------------

/**
 * Seniority is mostly derived from the title; providers rarely expose a
 * dedicated field. When a provider field is supplied, we still check the
 * title first because provider seniority strings are notoriously noisy.
 */
export function normalizeSeniority(
  title: string,
  raw?: string | null,
): Seniority {
  const haystack = `${title} ${raw ?? ''}`;
  for (const [re, level] of SENIORITY_RULES) {
    if (re.test(haystack)) return level;
  }
  return 'UNKNOWN';
}

// ---------------------------------------------------------------------------
// Location
// ---------------------------------------------------------------------------

const REMOTE_PREFIX = /^\s*(remote|fully\s+remote|remote\s*[-–—]\s*)/i;

export function normalizeLocation(raw: string): Location {
  const original = raw.trim();
  if (!original) return locationFromRaw(raw);

  const cleaned = original.replace(REMOTE_PREFIX, '').trim();
  if (!cleaned) return locationFromRaw(original);

  const parts = cleaned
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length === 0) return locationFromRaw(original);

  if (parts.length === 1) {
    const only = parts[0]!;
    const code = lookupCountry(only);
    if (code) return { countryCode: code, region: null, city: null, raw: original };
    return locationFromRaw(original);
  }

  const last = parts[parts.length - 1]!;
  const countryCode = lookupCountry(last);

  if (parts.length === 2 && countryCode) {
    return {
      countryCode,
      region: null,
      city: parts[0]!,
      raw: original,
    };
  }

  if (parts.length >= 3) {
    const maybeCountry = lookupCountry(parts[parts.length - 1]!);
    const maybeRegion = parts[parts.length - 2]!;
    const city = parts.slice(0, parts.length - 2).join(', ');
    if (maybeCountry) {
      return {
        countryCode: maybeCountry,
        region: maybeRegion,
        city,
        raw: original,
      };
    }
  }

  return locationFromRaw(original);
}

export function normalizeLocations(raws: readonly string[] | undefined): Location[] {
  if (!raws?.length) return [];
  return raws.map(normalizeLocation);
}

function lookupCountry(value: string): string | null {
  const key = value.trim().toLowerCase();
  return COUNTRY_NAME_TO_CODE[key] ?? null;
}