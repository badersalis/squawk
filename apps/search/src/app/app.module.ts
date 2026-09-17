import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller.js';
import { ItinerariesController } from './itineraries/itineraries.controller.js';
import { ItinerariesService } from './itineraries/itineraries.service.js';
import { ITINERARY_CACHE_PORT } from './itineraries/itinerary-cache.port.js';
import { RedisItineraryCacheAdapter } from './itineraries/redis-itinerary-cache.adapter.js';
import { HttpScheduleAdapter } from './schedule/http-schedule.adapter.js';
import { SCHEDULE_PORT } from './schedule/schedule.port.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TerminusModule],
  controllers: [ItinerariesController, HealthController],
  providers: [
    ItinerariesService,
    { provide: SCHEDULE_PORT, useClass: HttpScheduleAdapter },
    { provide: ITINERARY_CACHE_PORT, useClass: RedisItineraryCacheAdapter },
  ],
})
export class AppModule {}
