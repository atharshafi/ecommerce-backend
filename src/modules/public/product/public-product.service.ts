import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ProductFilterDto } from './dto/product-filter.dto';

@Injectable()
export class PublicProductService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: ProductFilterDto) {
    const {
      page = 1,
      limit = 20,
      search,
      categoryId,
      woodType,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    const skip = (page - 1) * limit;

    const where: any = {
      status: true,
      category: {
        isActive: true,
      },
    };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { woodType: { contains: search } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (woodType) {
      where.woodType = woodType;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true },
          },
          images: {
            take: 1,
            select: { id: true, imageUrl: true },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id, status: true },
      include: {
        category: { select: { id: true, name: true } },
        images: { select: { id: true, imageUrl: true } },
      },
    });

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async getFeaturedProducts(limit: number = 8) {
    return this.prisma.product.findMany({
      where: { status: true, stock: { gt: 0 } },
      include: {
        category: { select: { name: true } },
        images: { take: 1, select: { imageUrl: true } },
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRelatedProducts(productId: number, limit: number = 4) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { categoryId: true, woodType: true },
    });

    if (!product) return [];

    return this.prisma.product.findMany({
      where: {
        status: true,
        id: { not: productId },
        OR: [
          { categoryId: product.categoryId },
          { woodType: product.woodType },
        ],
      },
      include: { images: { take: 1, select: { imageUrl: true } } },
      take: limit,
    });
  }
}