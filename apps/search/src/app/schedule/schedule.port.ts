import type { Flight } from '@squawk/domain';

export interface SchedulePort {
  findFlights(origin: string, destination: string): Promise<Flight[]>;
}

export const SCHEDULE_PORT = Symbol('SCHEDULE_PORT');
