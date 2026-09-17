import type { Offer } from './offer.js';

export type OrderStatus = 'pending' | 'confirmed' | 'cancelled' | 'fulfilled';

export type OrderItemStatus =
  'awaiting_ticketing' | 'ticketed' | 'cancelled' | 'refunded';

/** One fulfillable unit of an Order (NDC-style): a segment plus its ticketing state. */
export interface OrderItem {
  id: string;
  segmentId: string;
  status: OrderItemStatus;
  ticketNumber?: string;
}

/** An accepted Offer becomes an Order. An Order is never "done" — it stays mutable via IROPS. */
export interface Order {
  id: string;
  offerId: Offer['id'];
  pnrLocator: string;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}
