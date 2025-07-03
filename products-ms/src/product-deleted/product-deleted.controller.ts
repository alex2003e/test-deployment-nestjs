import {  Controller } from '@nestjs/common';
import { ProductDeletedService } from './product-deleted.service';
import { PaginationDto, ResponsDto } from 'src/common/dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class ProductDeletedController {
  constructor(private readonly productDeletedService: ProductDeletedService) {}

  // @Get()
  @MessagePattern('products.deleted.get-all')
  async findAll(@Payload() paginationDto: PaginationDto): Promise<ResponsDto> {
    const result = await this.productDeletedService.findAll(paginationDto);
    return {
      success: true,
      message: 'Success find',
      data: result,
    };
  }

  // @Get(':id')
  @MessagePattern('products.deleted.get-by-id')
  async findOne(@Payload('id') id: string): Promise<ResponsDto> {
    const result = await this.productDeletedService.findOne(id);
    return {
      success: true,
      message: 'Success find',
      data: result,
    };
  }

  // @Get('by-idProduct/:id')
  @MessagePattern('products.deleted.get-by-idProduct')
  async findOneByIdProduct(@Payload('id') id: string): Promise<ResponsDto> {
    const result = await this.productDeletedService.findOneByIdProduct(id);
    return {
      success: true,
      message: 'Success find',
      data: result,
    };
  }
}
