import { describe, expect, it } from 'vitest';
import {
  normalizeEmploymentType,
  normalizeLocation,
  normalizeSeniority,
  normalizeWorkMode,
} from './normalizer.js';

describe('normalizeWorkMode', () => {
  it.each([
    ['Remote', 'REMOTE'],
    ['remote', 'REMOTE'],
    ['Fully Remote', 'REMOTE'],
    ['Remote - France', 'REMOTE'],
    ['Hybrid', 'HYBRID'],
    ['Partially Remote', 'HYBRID'],
    ['Onsite', 'ONSITE'],
    ['On-site', 'ONSITE'],
    ['', 'UNKNOWN'],
    [undefined, 'UNKNOWN'],
  ])('%s → %s', (input, expected) => {
    expect(normalizeWorkMode(input as string | undefined)).toBe(expected);
  });
});

describe('normalizeEmploymentType', () => {
  it.each([
    ['Full-time', 'FULL_TIME'],
    ['Part Time', 'PART_TIME'],
    ['Contract', 'CONTRACT'],
    ['Internship', 'INTERNSHIP'],
    ['Temporary', 'TEMPORARY'],
    ['Something else', 'UNKNOWN'],
  ])('%s → %s', (input, expected) => {
    expect(normalizeEmploymentType(input)).toBe(expected);
  });
});

describe('normalizeSeniority', () => {
  it.each([
    ['Senior Backend Engineer', 'SENIOR'],
    ['Staff Software Engineer', 'STAFF'],
    ['Principal Engineer', 'PRINCIPAL'],
    ['Junior Developer', 'JUNIOR'],
    ['Engineering Intern', 'INTERN'],
    ['Backend Engineer', 'UNKNOWN'],
  ])('%s → %s', (title, expected) => {
    expect(normalizeSeniority(title)).toBe(expected);
  });
});

describe('normalizeLocation', () => {
  it('parses "Remote - France"', () => {
    expect(normalizeLocation('Remote - France')).toEqual({
      countryCode: 'FR',
      region: null,
      city: null,
      raw: 'Remote - France',
    });
  });

  it('parses "Paris, France"', () => {
    expect(normalizeLocation('Paris, France')).toEqual({
      countryCode: 'FR',
      region: null,
      city: 'Paris',
      raw: 'Paris, France',
    });
  });

  it('parses "San Francisco, CA, US"', () => {
    expect(normalizeLocation('San Francisco, CA, US')).toEqual({
      countryCode: 'US',
      region: 'CA',
      city: 'San Francisco',
      raw: 'San Francisco, CA, US',
    });
  });

  it('falls back to raw for unparseable inputs', () => {
    expect(normalizeLocation('EMEA')).toEqual({
      countryCode: null,
      region: null,
      city: null,
      raw: 'EMEA',
    });
  });
});