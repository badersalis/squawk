import { describe, expect, it } from 'vitest';
import type { Flight, Itinerary } from '@squawk/domain';
import type { SchedulePort } from '../schedule/schedule.port.js';
import { ItinerariesService } from './itineraries.service.js';
import type { ItineraryCachePort } from './itinerary-cache.port.js';

const FLIGHT: Flight = {
  id: 'flt_aa100',
  airlineCode: 'AA',
  flightNumber: '100',
  originAirportCode: 'JFK',
  destinationAirportCode: 'LAX',
  scheduledDeparture: new Date('2026-10-01T13:00:00Z'),
  scheduledArrival: new Date('2026-10-01T16:22:00Z'),
  aircraftType: 'A321neo',
};

function fakeSchedule(flights: Flight[]): SchedulePort {
  return { findFlights: async () => flights };
}

function inMemoryCache(): ItineraryCachePort & {
  store: Map<string, Itinerary[]>;
} {
  const store = new Map<string, Itinerary[]>();
  return {
    store,
    get: async (key) => store.get(key),
    set: async (key, itineraries) => {
      store.set(key, itineraries);
    },
  };
}

describe('ItinerariesService', () => {
  it('wraps each matching flight as a non-stop itinerary', async () => {
    const service = new ItinerariesService(
      fakeSchedule([FLIGHT]),
      inMemoryCache(),
    );

    const result = await service.search('JFK', 'LAX');

    expect(result).toEqual([{ id: 'itin_flt_aa100', flights: [FLIGHT] }]);
  });

  it('serves from cache without calling the schedule port again', async () => {
    let calls = 0;
    const schedule: SchedulePort = {
      findFlights: async () => {
        calls++;
        return [FLIGHT];
      },
    };
    const service = new ItinerariesService(schedule, inMemoryCache());

    await service.search('JFK', 'LAX');
    await service.search('JFK', 'LAX');

    expect(calls).toBe(1);
  });
});
