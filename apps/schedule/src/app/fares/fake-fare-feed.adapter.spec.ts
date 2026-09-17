import { describe, expect, it } from 'vitest';
import { FakeFareFeedAdapter } from './fake-fare-feed.adapter.js';
import { UnknownBookingClassError } from './unknown-booking-class.error.js';

describe('FakeFareFeedAdapter', () => {
  const adapter = new FakeFareFeedAdapter();

  it('returns a stable fare for the same flight and booking class', async () => {
    const first = await adapter.getFare('flt_aa100', 'Y');
    const second = await adapter.getFare('flt_aa100', 'Y');
    expect(second).toEqual(first);
  });

  it('prices business above economy for the same flight', async () => {
    const economy = await adapter.getFare('flt_aa100', 'Y');
    const business = await adapter.getFare('flt_aa100', 'J');
    expect(business.baseFareAmount).toBeGreaterThan(economy.baseFareAmount);
  });

  it('rejects an unknown booking class', async () => {
    await expect(adapter.getFare('flt_aa100', 'Z')).rejects.toThrow(
      UnknownBookingClassError,
    );
  });
});
