import { Test, TestingModule } from '@nestjs/testing';
import { ProductDeletedService } from './product-deleted.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { PaginationDto } from '../common/dto';

describe('ProductDeletedService', () => {
  let service: ProductDeletedService;
  let prismaMock: Partial<PrismaService>;

  beforeEach(async () => {
    prismaMock = {
      productsDeleted: {
        count: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
      } as any,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductDeletedService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ProductDeletedService>(ProductDeletedService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated products deleted', async () => {
      (prismaMock.productsDeleted?.count as jest.Mock).mockResolvedValue(2);
      (prismaMock.productsDeleted?.findMany as jest.Mock).mockResolvedValue([
        { id: '1' },
        { id: '2' },
      ]);
      const dto: PaginationDto = { page: 1, limit: 2 };

      const result = await service.findAll(dto);
      expect(result.pagination.totalItems).toBe(2);
      expect(result.produts.length).toBe(2);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if product deleted not found', async () => {
      (prismaMock.productsDeleted?.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      await expect(service.findOne('not-found')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return a product if found', async () => {
      (prismaMock.productsDeleted?.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        name: 'product',
      });

      const result = await service.findOne('1');
      expect(result).toEqual({ id: '1', name: 'product' });
    });
  });

  describe('findOneByIdProduct', () => {
    it('should throw NotFoundException if product not found', async () => {
      (prismaMock.productsDeleted?.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      await expect(service.findOneByIdProduct('not-found')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return a product if found', async () => {
      (prismaMock.productsDeleted?.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        idProduct: '12',
        name: 'product',
      });

      const result = await service.findOneByIdProduct('1');
      expect(result).toEqual({ id: '1', idProduct: '12', name: 'product' });
    });
  });
});
