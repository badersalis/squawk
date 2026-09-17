export type CabinClass = 'economy' | 'premium_economy' | 'business' | 'first';

/** A booking class / RBD: the fare-bucket a seat is sold under, not the physical cabin. */
export interface BookingClass {
  code: string;
  cabin: CabinClass;
  fareBasisCode: string;
}
