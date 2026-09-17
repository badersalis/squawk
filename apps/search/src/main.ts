import { startTracing } from '@squawk/observability';

startTracing({ serviceName: 'search', serviceVersion: '0.0.1' });

import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  const swaggerDocument = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Search service')
      .setDescription(
        'Non-stop itinerary search over Schedule, cached in Redis.',
      )
      .setVersion('1')
      .build(),
  );
  SwaggerModule.setup(`${globalPrefix}/docs`, app, swaggerDocument);

  const port = process.env.PORT || 3002;
  await app.listen(port);
  Logger.log(
    `Search service running on: http://localhost:${port}/${globalPrefix}/v1`,
  );
  Logger.log(`API docs: http://localhost:${port}/${globalPrefix}/docs`);
}

bootstrap();
