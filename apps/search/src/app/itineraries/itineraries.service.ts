import { Inject, Injectable } from '@nestjs/common';
import type { Itinerary } from '@squawk/domain';
import { SCHEDULE_PORT, type SchedulePort } from '../schedule/schedule.port.js';
import {
  ITINERARY_CACHE_PORT,
  type ItineraryCachePort,
} from './itinerary-cache.port.js';

const CACHE_TTL_SECONDS = 60;

@Injectable()
export class ItinerariesService {
  constructor(
    @Inject(SCHEDULE_PORT) private readonly schedule: SchedulePort,
    @Inject(ITINERARY_CACHE_PORT) private readonly cache: ItineraryCachePort,
  ) {}

  async search(origin: string, destination: string): Promise<Itinerary[]> {
    const cacheKey = `itineraries:${origin}:${destination}`;

    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const flights = await this.schedule.findFlights(origin, destination);

    // Step 3 scope: non-stop only. Multi-leg connection-building is a follow-up.
    const itineraries: Itinerary[] = flights.map((flight) => ({
      id: `itin_${flight.id}`,
      flights: [flight],
    }));

    await this.cache.set(cacheKey, itineraries, CACHE_TTL_SECONDS);
    return itineraries;
  }
}
