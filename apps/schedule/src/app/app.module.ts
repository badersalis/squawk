import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { FakeFareFeedAdapter } from './fares/fake-fare-feed.adapter.js';
import { FARE_FEED_PORT } from './fares/fare-feed.port.js';
import { FaresController } from './fares/fares.controller.js';
import { FlightsController } from './flights/flights.controller.js';
import { FlightsService } from './flights/flights.service.js';
import { HealthController } from './health/health.controller.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TerminusModule],
  controllers: [FlightsController, FaresController, HealthController],
  providers: [
    FlightsService,
    { provide: FARE_FEED_PORT, useClass: FakeFareFeedAdapter },
  ],
})
export class AppModule {}
