import { Injectable } from '@nestjs/common';
import type { Flight } from '@squawk/domain';

const SEEDED_FLIGHTS: Flight[] = [
  {
    id: 'flt_aa100',
    airlineCode: 'AA',
    flightNumber: '100',
    originAirportCode: 'JFK',
    destinationAirportCode: 'LAX',
    scheduledDeparture: new Date('2026-10-01T13:00:00Z'),
    scheduledArrival: new Date('2026-10-01T16:22:00Z'),
    aircraftType: 'A321neo',
  },
  {
    id: 'flt_aa101',
    airlineCode: 'AA',
    flightNumber: '101',
    originAirportCode: 'LAX',
    destinationAirportCode: 'JFK',
    scheduledDeparture: new Date('2026-10-01T22:10:00Z'),
    scheduledArrival: new Date('2026-10-02T06:25:00Z'),
    aircraftType: 'A321neo',
  },
  {
    id: 'flt_ba178',
    airlineCode: 'BA',
    flightNumber: '178',
    originAirportCode: 'JFK',
    destinationAirportCode: 'LHR',
    scheduledDeparture: new Date('2026-10-01T18:35:00Z'),
    scheduledArrival: new Date('2026-10-02T06:40:00Z'),
    aircraftType: 'B777-300ER',
  },
];

@Injectable()
export class FlightsService {
  findAll(): Flight[] {
    return SEEDED_FLIGHTS;
  }
}
