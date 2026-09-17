import { Injectable } from '@nestjs/common';
import type { FareFeedPort, FareQuote } from './fare-feed.port.js';
import { UnknownBookingClassError } from './unknown-booking-class.error.js';

// Fare relative to Y (full-fare economy), roughly reflecting real RBD pricing spread.
const CLASS_MULTIPLIER: Record<string, number> = {
  Y: 1,
  B: 0.75,
  M: 0.55,
  J: 3.2,
  F: 5.5,
};

const BASE_FARE_CENTS = 10_000; // $100.00

function stableHash(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

@Injectable()
export class FakeFareFeedAdapter implements FareFeedPort {
  async getFare(
    flightId: string,
    bookingClassCode: string,
  ): Promise<FareQuote> {
    const multiplier = CLASS_MULTIPLIER[bookingClassCode];
    if (multiplier === undefined) {
      throw new UnknownBookingClassError(bookingClassCode);
    }

    // Deterministic per flight so repeated lookups agree within a session, while
    // still varying flight-to-flight like a real fare feed would.
    const flightVariance = 1 + (stableHash(flightId) % 200) / 1000;
    const baseFareAmount = Math.round(
      BASE_FARE_CENTS * multiplier * flightVariance,
    );

    return {
      bookingClassCode,
      currency: 'USD',
      baseFareAmount,
    };
  }
}
