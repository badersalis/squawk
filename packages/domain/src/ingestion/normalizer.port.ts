import { Location, locationFromRaw } from '../shared/location';

/**
 * Best-effort parse of a provider location string into structured fields.
 *
 * Examples it handles:
 *   "Remote - France"        → { countryCode: 'FR', region: null, city: null }
 *   "Paris, France"          → { countryCode: 'FR', region: null, city: 'Paris' }
 *   "Berlin, Germany"        → { countryCode: 'DE', region: null, city: 'Berlin' }
 *   "San Francisco, CA, US"  → { countryCode: 'US', region: 'CA', city: 'San Francisco' }
 *   "EMEA"                   → { countryCode: null, region: null, city: null }
 *
 * Anything we can't parse falls back to `locationFromRaw(raw)`.
 */
export function normalizeLocation(raw: string): Location {
  const trimmed = raw.trim();
  if (!trimmed) return locationFromRaw(raw);

  // Strip common "Remote -" prefixes.
  const cleaned = trimmed.replace(/^remote\s*[-–—]\s*/i, '').trim();

  const parts = cleaned.split(',').map((p) => p.trim()).filter(Boolean);
  if (parts.length === 1) {
    const cc = COUNTRY_NAME_TO_CODE[parts[0].toLowerCase()];
    if (cc) return { countryCode: cc, region: null, city: null, raw: trimmed };
    return locationFromRaw(raw);
  }

  const last = parts[parts.length - 1];
  const countryCode = COUNTRY_NAME_TO_CODE[last.toLowerCase()] ?? null;

  // "City, Region, Country" vs "City, Country"
  const city = parts[0];
  const region = parts.length === 3 ? parts[1] : null;

  return {
    countryCode,
    region,
    city,
    raw: trimmed,
  };
}

const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  france: 'FR',
  germany: 'DE',
  'united states': 'US',
  usa: 'US',
  'united kingdom': 'GB',
  uk: 'GB',
  // …extend when needed
};