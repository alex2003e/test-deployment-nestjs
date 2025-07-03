import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto, ResponsDto } from 'src/common/dto';
import { PRODUCTS_SERVICE } from 'src/config';
import { CreateProductDto, UpdateProductDto } from './dto';
import { firstValueFrom } from 'rxjs';

@Controller('products-ms')
export class ProductsMsController {
  constructor(@Inject(PRODUCTS_SERVICE) private readonly productsMsClient: ClientProxy ) {}


  @Get()
  async getAll(@Query() paginationDto: PaginationDto) {
    try {
      return await firstValueFrom(this.productsMsClient.send('products.get-all',paginationDto));  
    } catch (error) {  throw new RpcException(error); }
    
  }


  @Get('/:id')
  async getById(@Param('id') id: string) {
    try {
      return await firstValueFrom(this.productsMsClient.send('products.get-by-id',id));
    } catch (error) {  throw new RpcException(error); }
  }

  @Post('create')
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      return await firstValueFrom(this.productsMsClient.send('products.create',createProductDto));
    } catch (error) { throw new RpcException(error); }
  }


  @Patch('update/:id')
    async Update(@Param('id') id:string, @Body() updateProductDto: UpdateProductDto) {
    try {
      return await firstValueFrom(this.productsMsClient.send('products.update',{ id, ...updateProductDto}));
    } catch (error) {  throw new RpcException(error); }
  }

  @Patch('update-status/:id')
  async UpdateStatus(@Param('id') id: string) {
    try {
      return await firstValueFrom(this.productsMsClient.send('products.update-status',{id}));
    } catch (error) {  throw new RpcException(error); }
  }

  @Delete('/:id')
  async Delete(@Param('id') id: string) {
    try {
      return await firstValueFrom(this.productsMsClient.send('products.delete',{id}));
    } catch (error) {  throw new RpcException(error); }
  }



}
