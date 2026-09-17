import { startTracing } from '@squawk/observability';

startTracing({ serviceName: 'schedule', serviceVersion: '0.0.1' });

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `Schedule service running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
