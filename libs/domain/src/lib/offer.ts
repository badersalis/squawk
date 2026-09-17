import type { Segment } from './segment.js';

export interface PriceBreakdown {
  currency: string;
  baseFareAmount: number;
  taxAmount: number;
  surchargeAmount: number;
  totalAmount: number;
}

export type OfferStatus = 'active' | 'expired' | 'accepted';

/** A time-bound priced itinerary. Price-at-search is not price-at-book: check expiresAt. */
export interface Offer {
  id: string;
  segments: Segment[];
  price: PriceBreakdown;
  expiresAt: Date;
  status: OfferStatus;
  createdAt: Date;
}
