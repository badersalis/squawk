import type { Itinerary } from '@squawk/domain';

export interface ItineraryCachePort {
  get(key: string): Promise<Itinerary[] | undefined>;
  set(key: string, itineraries: Itinerary[], ttlSeconds: number): Promise<void>;
}

export const ITINERARY_CACHE_PORT = Symbol('ITINERARY_CACHE_PORT');
