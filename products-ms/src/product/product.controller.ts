import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { PaginationDto, ResponsDto } from 'src/common/dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // @Post('create')
  @MessagePattern('products.create')
  async create(@Payload() createProductDto: CreateProductDto ): Promise<ResponsDto> {
    const newProduct = await this.productService.create(createProductDto);
    return {
      success: true,
      message: 'Create Product',
      data: newProduct,
    };
  }

  // @Get()
  @MessagePattern('products.get-all')
  async findAll(@Payload() paginationDto: PaginationDto): Promise<ResponsDto> {
    // console.log(paginationDto)
    const result = await this.productService.findAll(paginationDto);
    return {
      success: true,
      message: 'Success find',
      data: result,
    };
  }

  // @Get(':id')
  @MessagePattern('products.get-by-id')
  async findOne(@Payload('id') id: string) {
    const result = await this.productService.findOne(id);
    return {
      success: true,
      message: 'Success find',
      data: result,
    };
  }

  // @Patch('update/:id')
  @MessagePattern('products.update')
  async update( @Payload() updateProductDto: UpdateProductDto ) {
    const result = await this.productService.update(updateProductDto.id, updateProductDto);

    return {
      success: true,
      message: 'Update product success.',
      data: result,
    };
  }

  // @Patch('update-status/:id')
  @MessagePattern('products.update-status')
  async updateStatus( @Payload() id: string) {
    const result = await this.productService.updateStatus(id);
    return {
      success: true,
      message: 'Update status success.',
      data: result,
    };
  }

  // @Delete(':id')
  @MessagePattern('products.delete')
  async remove(@Payload('id') id: string) {
    await this.productService.remove(id);
    return {
      success: true,
      message: 'Delete succes.',
      data: {},
    };
  }
}
