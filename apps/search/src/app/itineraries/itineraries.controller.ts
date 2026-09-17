import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ItinerariesService } from './itineraries.service.js';

@ApiTags('itineraries')
@Controller('itineraries')
export class ItinerariesController {
  constructor(private readonly itineraries: ItinerariesService) {}

  @Get()
  @ApiOperation({
    summary: 'Search non-stop itineraries between two airports',
  })
  @ApiQuery({ name: 'origin', example: 'JFK' })
  @ApiQuery({ name: 'destination', example: 'LAX' })
  @ApiOkResponse({ description: 'Cached, non-stop itineraries.' })
  async search(
    @Query('origin') origin?: string,
    @Query('destination') destination?: string,
  ) {
    if (!origin || !destination) {
      throw new BadRequestException('origin and destination are required');
    }
    return this.itineraries.search(
      origin.toUpperCase(),
      destination.toUpperCase(),
    );
  }
}
