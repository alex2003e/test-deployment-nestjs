import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationDto } from '../common/dto';
import { ResponsDto } from '../common/dto/respons.dto';
import { PrismaService } from '../prisma';

@Injectable()
export class ProductDeletedService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const totalProductsDeleted = await this.prisma.productsDeleted.count();
    const productsDeletedAll = await this.prisma.productsDeleted.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      produts: productsDeletedAll,
      pagination: {
        page,
        totalItems: totalProductsDeleted,
        LastPage: Math.ceil(totalProductsDeleted / limit),
        limit,
      },
    };
  }

  async findOne(id: string) {
    const productById = await this.prisma.productsDeleted
      .findUnique({ where: { id: id } })
      .finally();

    if (!productById) {
      const result: ResponsDto = {
        success: false,
        message: 'Product not found.',
        data: {},
      };
      throw new NotFoundException(result);
    }
    return productById;
  }

  async findOneByIdProduct(id: string) {
    const productById = await this.prisma.productsDeleted
      .findUnique({ where: { idProduct: id } })
      .finally();

    if (!productById) {
      const result: ResponsDto = {
        success: false,
        message: 'Product not found.',
        data: {},
      };
      throw new NotFoundException(result);
    }
    return productById;
  }
}
