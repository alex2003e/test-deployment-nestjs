import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { bootstrapTelemetry } from './tracing';
import { OpenTelemetryLogger } from './opentelemetry.logger';

async function bootstrap() {
  bootstrapTelemetry();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: envs.natsServer,
      },
      bufferLogs: true,
    },
  );

  app.useLogger(new OpenTelemetryLogger());
  await app.listen();
}
bootstrap();
