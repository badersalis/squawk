import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { FlightsController } from './flights/flights.controller.js';
import { FlightsService } from './flights/flights.service.js';
import { HealthController } from './health/health.controller.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TerminusModule],
  controllers: [FlightsController, HealthController],
  providers: [FlightsService],
})
export class AppModule {}
