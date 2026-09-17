import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Flight } from '@squawk/domain';
import { FlightsService } from './flights.service.js';

@ApiTags('flights')
@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get()
  @ApiOperation({ summary: 'List scheduled flights' })
  @ApiOkResponse({ description: 'Seeded, in-memory flight data.' })
  findAll(): Flight[] {
    return this.flightsService.findAll();
  }
}
