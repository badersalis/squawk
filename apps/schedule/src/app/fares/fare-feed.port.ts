export interface FareQuote {
  bookingClassCode: string;
  currency: string;
  baseFareAmount: number;
}

/**
 * Stands in for a real airline's revenue-management/ATPCO fare feed, which is
 * commercially gated and can't be obtained here. Only the data is simulated —
 * this port is what a real feed adapter would implement.
 */
export interface FareFeedPort {
  getFare(flightId: string, bookingClassCode: string): Promise<FareQuote>;
}

export const FARE_FEED_PORT = Symbol('FARE_FEED_PORT');
