import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { ExceptionFilter } from './common/exception';

async function bootstrap() {
  const logger = new Logger('Client Gateway');

  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  app.useGlobalFilters(new ExceptionFilter());
  await app.listen(envs.port);
  logger.log(`runnig on port: ${envs.port}`);

}
bootstrap();  
