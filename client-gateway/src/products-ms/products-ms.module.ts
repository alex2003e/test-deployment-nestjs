import { Module } from '@nestjs/common';
import { ProductsMsController } from './products-ms.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCTS_SERVICE, envs } from 'src/config';

@Module({
  controllers: [ProductsMsController],
  providers: [],
  imports:[
    ClientsModule.register([
      {
        name: PRODUCTS_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.hostProductsMs,
          port: envs.portProductsMs,
        }
      }
    ])
  ]
})
export class ProductsMsModule {}
