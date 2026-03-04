import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
@Injectable()
export class PublicCategoryService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const categories = await this.prisma.category.findMany({
      where: { isActive: true },
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });

    return categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      isActive: cat.isActive,
      productCount: cat._count.products,
    }));
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id, isActive: true },
      include: {
        products: {
          where: { status: true },
          take: 10,
          select: {
            id: true,
            name: true,
            price: true,
            woodType: true,
            images: { take: 1, select: { imageUrl: true } },
          },
        },
        _count: { select: { products: true } },
      },
    });

    if (!category) throw new NotFoundException('Category not found');

    return {
      id: category.id,
      name: category.name,
      isActive: category.isActive,
      productCount: category._count.products,
      products: category.products,
    };
  }
}