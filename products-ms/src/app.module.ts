import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { ProductDeletedModule } from './product-deleted/product-deleted.module';
import { LoggerModule } from 'nestjs-pino';
import { OpenTelemetryLogger } from './opentelemetry.logger';

@Module({
  imports: [
    ProductModule,
    ProductDeletedModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-opentelemetry-transport',
          options: {
            messageKey: 'message',
          },
        },
      },
    }),
  ],
  controllers: [],
  providers: [OpenTelemetryLogger],
})
export class AppModule {}
