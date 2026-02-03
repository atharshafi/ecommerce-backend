import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductImageService } from '../product/images/product-image.service';
import { ProductImageController } from './images/product-image.controller';

@Module({
  providers: [ProductService, ProductImageService],
  controllers: [ProductController, ProductImageController]
})
export class ProductModule {}
