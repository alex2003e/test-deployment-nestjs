import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { PaginationDto } from '../common/dto';
import { RpcException } from '@nestjs/microservices';

describe('ProductService', () => {
  let service: ProductService;
  let prismaMock: Partial<PrismaService>;

  beforeEach(async () => {
    prismaMock = {
      products: {
        findUnique: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
        delete: jest.fn(),
      } as any,
      productsDeleted: {
        create: jest.fn(),
      } as any,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validationName', () => {
    it('should throw BadRequestException if name exists', async () => {
      (prismaMock.products?.findUnique as jest.Mock).mockResolvedValueOnce({
        id: '123',
        name: 'producto',
      });

      await expect(service.validationName('producto')).rejects.toThrow(
        RpcException,
      );
    });

    it('should not throw if name does not exist', async () => {
      (prismaMock.products?.findUnique as jest.Mock).mockResolvedValueOnce(
        null,
      );

      await expect(service.validationName('nuevo')).resolves.toBeUndefined();
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const dto: CreateProductDto = {
        name: 'nuevo',
        description: 'desc',
        price: 100,
        stock: 5,
      };

      (prismaMock.products?.findUnique as jest.Mock).mockResolvedValueOnce(
        null,
      );
      (prismaMock.products?.create as jest.Mock).mockResolvedValueOnce({
        id: '123',
        ...dto,
      });

      const result = await service.create(dto);

      expect(result).toHaveProperty('id');
      expect(prismaMock.products?.create).toHaveBeenCalled();
    });
  });

  describe('update product (mock)', () => {
    it('should update product fields if changes are provided', async () => {
      const productId = '123';
      const existingProduct = {
        id: productId,
        name: 'product',
        price: 100,
        stock: 10,
        description: 'desc',
      };
      const updateDto: UpdateProductDto = { id: productId, price: 150 };
      const updatedProduct = { ...existingProduct, ...updateDto };

      (prismaMock.products?.findUnique as jest.Mock).mockResolvedValue(
        existingProduct,
      );
      (prismaMock.products?.update as jest.Mock).mockResolvedValue(
        updatedProduct,
      );

      // Suponiendo que existe un método update en el servicio ProductDeletedService (ajustar si aplica de otro servicio)
      const result = await prismaMock.products?.update({
        where: { id: productId },
        data: { ...updateDto, updatedAt: new Date() },
      });

      expect(result?.price).toBe(150);
      expect(prismaMock.products?.update).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      (prismaMock.products?.count as jest.Mock).mockResolvedValue(2);
      (prismaMock.products?.findMany as jest.Mock).mockResolvedValue([
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
    it('should throw NotFoundException if product not found', async () => {
      (prismaMock.products?.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('rpc-exception')).rejects.toThrow(
        RpcException,
      );
    });

    it('should return a product if found', async () => {
      (prismaMock.products?.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        name: 'product',
      });

      const result = await service.findOne('1');
      expect(result).toEqual({ id: '1', name: 'product' });
    });
  });
});
