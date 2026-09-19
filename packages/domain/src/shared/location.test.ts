import { describe, expect, it } from 'vitest';
import { locationFromRaw, locationsEqual } from './location.js';

describe('locationFromRaw', () => {
  it('preserves the raw string and leaves structured fields null', () => {
    const loc = locationFromRaw('  Remote - France  ');
    expect(loc).toEqual({
      countryCode: null,
      region: null,
      city: null,
      raw: 'Remote - France',
    });
  });
});

describe('locationsEqual', () => {
  it('ignores case and whitespace', () => {
    const a = { countryCode: 'FR', region: null, city: 'Paris', raw: 'Paris, FR' };
    const b = { countryCode: 'fr', region: null, city: ' paris ', raw: 'PARIS, FR' };
    expect(locationsEqual(a, b)).toBe(true);
  });

  it('treats two unparseable raws as equal (both null structured)', () => {
    const a = locationFromRaw('EMEA');
    const b = locationFromRaw('APAC');
    expect(locationsEqual(a, b)).toBe(true);
  });
});