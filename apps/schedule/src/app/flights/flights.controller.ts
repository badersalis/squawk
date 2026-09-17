import { Controller, Get } from '@nestjs/common';
import type { Flight } from '@squawk/domain';
import { FlightsService } from './flights.service.js';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get()
  findAll(): Flight[] {
    return this.flightsService.findAll();
  }
}
