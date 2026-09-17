import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
} from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { FlightsService } from '../flights/flights.service.js';
import { FARE_FEED_PORT, type FareFeedPort } from './fare-feed.port.js';
import { UnknownBookingClassError } from './unknown-booking-class.error.js';

@ApiTags('fares')
@Controller('flights/:flightId/fares')
export class FaresController {
  constructor(
    private readonly flightsService: FlightsService,
    @Inject(FARE_FEED_PORT) private readonly fareFeed: FareFeedPort,
  ) {}

  @Get(':bookingClassCode')
  @ApiOperation({
    summary: 'Simulated fare/revenue feed lookup for a flight + booking class',
  })
  @ApiParam({ name: 'flightId', example: 'flt_aa100' })
  @ApiParam({ name: 'bookingClassCode', example: 'Y' })
  @ApiOkResponse({ description: 'A simulated fare quote.' })
  @ApiNotFoundResponse({
    description: 'Unknown flight or unknown booking class.',
  })
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
