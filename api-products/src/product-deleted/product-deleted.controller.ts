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
import { ProductDeletedService } from './product-deleted.service';
import { PaginationDto } from 'src/common/dto';

@Controller('product-deleted')
export class ProductDeletedController {
  constructor(private readonly productDeletedService: ProductDeletedService) {}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.productDeletedService.findAll(paginationDto);
    return {
      success: true,
      message: 'Success find',
      data: result,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.productDeletedService.findOne(id);
    return {
      success: true,
      message: 'Success find',
      data: result,
    };
  }

  @Get('by-idProduct/:id')
  async findOneByIdProduct(@Param('id') id: string) {
    const result = await this.productDeletedService.findOneByIdProduct(id);
    return {
      success: true,
      message: 'Success find',
      data: result,
    };
  }
}
