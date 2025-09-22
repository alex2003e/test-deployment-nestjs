import { Module } from '@nestjs/common';
import { ProductsMsModule } from './products-ms/products-ms.module';
import { OpenTelemetryLogger } from './opentelemetry.logger';

@Module({
  imports: [ProductsMsModule],
  providers: [OpenTelemetryLogger],
})
export class AppModule {}
