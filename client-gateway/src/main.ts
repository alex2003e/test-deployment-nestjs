// 1. Importa la función de tracing ANTES que cualquier otra cosa.
import { bootstrapTelemetry } from './tracing';

// 2. Ejecuta la función de tracing INMEDIATAMENTE, fuera del bootstrap.
//    Esto "parchea" los módulos antes de que NestJS los cargue.
bootstrapTelemetry();

// 3. Ahora sí, importa el resto de los módulos de NestJS y de tu aplicación.
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { ExceptionFilter } from './common/exception';
import { OpenTelemetryLogger } from './opentelemetry.logger';

async function bootstrap() {
  // Ya no necesitas llamar a bootstrapTelemetry() aquí.
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  app.useGlobalFilters(new ExceptionFilter());
  app.useLogger(new OpenTelemetryLogger());

  await app.listen(envs.port);
}
bootstrap();
