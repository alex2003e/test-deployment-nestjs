import { Module } from '@nestjs/common';
import { ProductsMsModule } from './products-ms/products-ms.module';

@Module({
  imports: [ProductsMsModule],
})
export class AppModule {}
