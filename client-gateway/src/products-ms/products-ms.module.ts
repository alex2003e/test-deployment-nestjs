import { Module } from '@nestjs/common';
import { ProductsMsController } from './products-ms.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NATS_SERVER, envs } from 'src/config';

@Module({
  controllers: [ProductsMsController],
  providers: [],
  imports:[
    ClientsModule.register([
      {
        name: NATS_SERVER,
        transport: Transport.NATS,
        options:{
          server: envs.serverNats
        }
        // transport: Transport.TCP,
        // options: {
        //   host: envs.hostProductsMs,
        //   port: envs.portProductsMs,
        // }
      }
    ])
  ]
})
export class ProductsMsModule {}
