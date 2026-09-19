/**
 * A location attached to a Company or a Job.
 *
 * `raw` is always preserved exactly as the provider supplied it. The
 * structured fields are a *best-effort* interpretation and may be null.
 * This keeps us lossless: if our parser improves later, we can re-derive
 * structured fields from `raw` without re-fetching from the provider.
 */
export interface Location {
  /** ISO-3166-1 alpha-2, uppercase. e.g. "FR", "DE", "US". */
  countryCode: string | null;
  /** Free-form region / state / province. e.g. "Île-de-France", "California". */
  region: string | null;
  /** City name. e.g. "Paris", "Berlin". */
  city: string | null;
  /** Original string from the provider. Never null, never empty. */
  raw: string;
}

/** Build a Location from a raw string when we can't parse it. */
export function locationFromRaw(raw: string): Location {
  return {
    countryCode: null,
    region: null,
    city: null,
    raw: raw.trim(),
  };
}

/**
 * Structural equality for deduplication. Deliberately ignores case and
 * surrounding whitespace so "Paris, FR" and "paris, fr" are one location.
 */
export function locationsEqual(a: Location, b: Location): boolean {
  return (
    normalizeKey(a.countryCode) === normalizeKey(b.countryCode) &&
    normalizeKey(a.region) === normalizeKey(b.region) &&
    normalizeKey(a.city) === normalizeKey(b.city)
  );
}

function normalizeKey(v: string | null): string {
  return (v ?? '').trim().toLowerCase();
}