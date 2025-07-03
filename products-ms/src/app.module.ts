import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { ProductDeletedModule } from './product-deleted/product-deleted.module';

@Module({
  imports: [ProductModule, ProductDeletedModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
