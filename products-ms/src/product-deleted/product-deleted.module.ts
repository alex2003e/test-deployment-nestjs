import { Module } from '@nestjs/common';
import { ProductDeletedService } from './product-deleted.service';
import { ProductDeletedController } from './product-deleted.controller';
import { PrismaService } from 'src/prisma';

@Module({
  controllers: [ProductDeletedController],
  providers: [ProductDeletedService, PrismaService],
})
export class ProductDeletedModule {}
