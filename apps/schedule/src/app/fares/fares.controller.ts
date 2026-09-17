import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { FlightsService } from '../flights/flights.service.js';
import { FARE_FEED_PORT, type FareFeedPort } from './fare-feed.port.js';
import { UnknownBookingClassError } from './unknown-booking-class.error.js';

@Controller('flights/:flightId/fares')
export class FaresController {
  constructor(
    private readonly flightsService: FlightsService,
    @Inject(FARE_FEED_PORT) private readonly fareFeed: FareFeedPort,
  ) {}

  @Get(':bookingClassCode')
  async getFare(
    @Param('flightId') flightId: string,
    @Param('bookingClassCode') bookingClassCode: string,
  ) {
    if (!this.flightsService.findById(flightId)) {
      throw new NotFoundException(`Unknown flight: ${flightId}`);
    }

    try {
      return await this.fareFeed.getFare(flightId, bookingClassCode);
    } catch (error) {
      if (error instanceof UnknownBookingClassError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
