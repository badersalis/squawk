import type { Flight } from './flight.js';

/**
 * An ordered sequence of flights forming a journey. No booking class yet — that's
 * only chosen once a fare is selected and priced into an Offer.
 */
export interface Itinerary {
  id: string;
  flights: Flight[];
}
