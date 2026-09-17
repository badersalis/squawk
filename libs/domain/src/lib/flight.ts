export interface Flight {
  id: string;
  airlineCode: string;
  flightNumber: string;
  originAirportCode: string;
  destinationAirportCode: string;
  scheduledDeparture: Date;
  scheduledArrival: Date;
  aircraftType: string;
}
