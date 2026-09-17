import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import type { Flight, Itinerary } from '@squawk/domain';
import type { ItineraryCachePort } from './itinerary-cache.port.js';

type WireItinerary = Omit<Itinerary, 'flights'> & {
  flights: Array<
    Omit<Flight, 'scheduledDeparture' | 'scheduledArrival'> & {
      scheduledDeparture: string;
      scheduledArrival: string;
    }
  >;
};

@Injectable()
export class RedisItineraryCacheAdapter
  implements ItineraryCachePort, OnModuleDestroy
{
  private readonly client: Redis;

  constructor(config: ConfigService) {
    this.client = new Redis(
      config.get<string>('REDIS_URL', 'redis://localhost:6380'),
    );
  }

  async get(key: string): Promise<Itinerary[] | undefined> {
    const raw = await this.client.get(key);
    if (!raw) {
      return undefined;
    }

    const wireItineraries = JSON.parse(raw) as WireItinerary[];
    return wireItineraries.map((itinerary) => ({
      ...itinerary,
      flights: itinerary.flights.map((flight) => ({
        ...flight,
        scheduledDeparture: new Date(flight.scheduledDeparture),
        scheduledArrival: new Date(flight.scheduledArrival),
      })),
    }));
  }

  async set(
    key: string,
    itineraries: Itinerary[],
    ttlSeconds: number,
  ): Promise<void> {
    await this.client.set(key, JSON.stringify(itineraries), 'EX', ttlSeconds);
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }
}
