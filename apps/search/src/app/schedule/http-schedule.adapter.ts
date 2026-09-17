import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Flight } from '@squawk/domain';
import type { SchedulePort } from './schedule.port.js';

type WireFlight = Omit<Flight, 'scheduledDeparture' | 'scheduledArrival'> & {
  scheduledDeparture: string;
  scheduledArrival: string;
};

@Injectable()
export class HttpScheduleAdapter implements SchedulePort {
  constructor(private readonly config: ConfigService) {}

  async findFlights(origin: string, destination: string): Promise<Flight[]> {
    const baseUrl = this.config.get<string>(
      'SCHEDULE_SERVICE_URL',
      'http://localhost:3000',
    );
    const response = await fetch(`${baseUrl}/api/v1/flights`);
    if (!response.ok) {
      throw new Error(`Schedule service returned ${response.status}`);
    }

    const wireFlights = (await response.json()) as WireFlight[];
    return wireFlights
      .map((flight) => ({
        ...flight,
        scheduledDeparture: new Date(flight.scheduledDeparture),
        scheduledArrival: new Date(flight.scheduledArrival),
      }))
      .filter(
        (flight) =>
          flight.originAirportCode === origin &&
          flight.destinationAirportCode === destination,
      );
  }
}
