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
import { PaginationDto } from 'src/common/dto';
import { ResponsDto } from 'src/common/dto/respons.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ResponsDto> {
    const newProduct = await this.productService.create(createProductDto);
    return {
      success: true,
      message: 'Create Product',
      data: newProduct,
    };
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto): Promise<ResponsDto> {
    const result = await this.productService.findAll(paginationDto);
    return {
      success: true,
      message: 'Success find',
      data: result,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.productService.findOne(id);
    return {
      success: true,
      message: 'Success find',
      data: result,
    };
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const result = await this.productService.update(id, updateProductDto);

    return {
      success: true,
      message: 'Update product success.',
      data: result,
    };
  }

  @Patch('update-status/:id')
  async updateStatus(@Param('id') id: string) {
    const result = await this.productService.updateStatus(id);
    return {
      success: true,
      message: 'Update status success.',
      data: result,
    };
  }
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.productService.remove(id);
    return {
      success: true,
      message: 'Delete succes.',
      data: {},
    };
  }
}
