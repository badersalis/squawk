import type { Flight } from './flight.js';
import type { BookingClass } from './booking-class.js';

/** One flown leg of an itinerary, priced under a specific booking class. */
export interface Segment {
  id: string;
  flight: Flight;
  bookingClass: BookingClass;
  sequence: number;
}
