/**
 * What a provider adapter returns.
 *
 * Everything is optional except the fields we cannot do without. Strings
 * are still provider-shaped (e.g. "Remote - France"); the normalizer is
 * responsible for turning them into domain enums and `Location` values.
 */
export interface RawJob {
  externalId: string;
  title: string;
  description: string;
  applicationUrl: string;
  department?: string;
  employmentType?: string;
  seniority?: string;
  workMode?: string;
  /** Raw provider strings, e.g. ["Remote - France", "Berlin, DE"]. */
  locations?: string[];
  publishedAt?: Date;
  sourceUpdatedAt?: Date;
  providerMetadata?: Record<string, unknown>;
}