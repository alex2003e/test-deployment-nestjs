import { Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { PaginationDto, ResponsExceptionDto } from '../common/dto';
import { v4 as uuidV4 } from 'uuid';
import { PrismaService } from '../prisma';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async validationName(name: string) {
    const existing = await this.prisma.products.findUnique({
      where: { name: name.toLowerCase() },
    });

    if (existing) {
      const result: ResponsExceptionDto = {
        statusCode: 400,
        success: false,
        message: 'Product exist.',
        data: {},
      };
      throw new RpcException(result);
    }
  }

  async create(createProductDto: CreateProductDto) {
    await this.validationName(createProductDto.name);
    return await this.prisma.products.create({
      data: {
        id: uuidV4(),
        name: createProductDto.name.toLocaleLowerCase(),
        description: createProductDto.description,
        price: createProductDto.price,
        stock: createProductDto.stock,
        asset: true,
      },
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const totalProducts = await this.prisma.products.count();
    const productsAll = await this.prisma.products.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      produts: productsAll,
      pagination: {
        page,
        totalItems: totalProducts,
        LastPage: Math.ceil(totalProducts / limit),
        limit,
      },
    };
  }

  async findOne(id: string) {
    const productById = await this.prisma.products
      .findUnique({ where: { id: id } })
      .finally();

    if (!productById) {
      const result: ResponsExceptionDto = {
        statusCode: 404,
        success: false,
        message: 'Product not found.',
        data: {},
      };
      throw new RpcException(result);
    }
    return productById;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const productById = await this.findOne(id);
    
    const { name, description, price, stock } = updateProductDto;

    if (!name && !description && !price && !stock) return productById;

    if (name && productById.name !== name.toLocaleLowerCase()) {
      await this.validationName(`${name}`);
    }
    const {id: ___, ...data } = updateProductDto;
    return this.prisma.products.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
  }

  async updateStatus(id: string) {
    const productById = await this.findOne(id);
    return await this.prisma.products.update({
      where: { id },
      data: {
        name: productById.name,
        description: productById.description,
        price: productById.price,
        stock: productById.stock,
        asset: !productById.asset,
        updatedAt: new Date(),
      },
    });
  }

  async remove(id: string) {
    const productById = await this.findOne(id);

    await this.prisma.productsDeleted.create({
      data: {
        id: uuidV4(),
        idProduct: productById.id,
        name: productById.name,
        description: productById.description,
        price: productById.price,
        stock: productById.stock,
        createdAtProduct: productById.createdAt,
      },
    });

    await this.prisma.products.delete({ where: { id: id } });
  }
}
