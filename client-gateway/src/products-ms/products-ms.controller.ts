import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto, ResponsDto } from 'src/common/dto';
import { NATS_SERVER } from 'src/config';
import { CreateProductDto, UpdateProductDto } from './dto';
import { catchError, firstValueFrom } from 'rxjs';

@Controller('products-ms')
export class ProductsMsController {
  constructor(@Inject(NATS_SERVER) private readonly productsMsClient: ClientProxy ) {}

  @Get()
  async getAll(@Query() paginationDto: PaginationDto) {
    return await this.productsMsClient.send('products.get-all',paginationDto).pipe(catchError(err => {throw new RpcException(err)}));
  }

  @Get('/:id')
  async getById(@Param('id') id: string) {
    return await this.productsMsClient.send('products.get-by-id',{id}).pipe(catchError(err => {throw new RpcException(err)}));
  }   
   
  @Post('create')
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productsMsClient.send('products.create',createProductDto).pipe(catchError(err => {throw new RpcException(err)}));
  }
   
  @Patch('update/:id')
  async Update(@Param('id') id:string, @Body() updateProductDto: UpdateProductDto) {
    return await this.productsMsClient.send('products.update',{ id, ...updateProductDto}).pipe(catchError(err => {throw new RpcException(err)}));
  }
   
  @Patch('update-status/:id')
  async UpdateStatus(@Param('id') id: string) {
    return await this.productsMsClient.send('products.update-status',{id}).pipe(catchError(err => {throw new RpcException(err)}));
  }
   
  @Delete('/:id')
  async Delete(@Param('id') id: string) {
    return await this.productsMsClient.send('products.delete',{id}).pipe(catchError(err => {throw new RpcException(err)}));
  } 

}
