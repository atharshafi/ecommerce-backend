import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class ProductImageService {
  constructor(private prisma: PrismaService) {}

  async addImages(productId: number, imageUrls: string[]) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    const data = imageUrls.map((url) => ({
      imageUrl: url,
      productId,
    }));

    return this.prisma.productImage.createMany({ data });
  }
}
