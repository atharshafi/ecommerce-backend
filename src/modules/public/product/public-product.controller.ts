import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { PublicProductService } from './public-product.service';
import { ProductFilterDto } from './dto/product-filter.dto';

@Controller('public/products')
export class PublicProductController {
  constructor(private readonly productService: PublicProductService) {}

  @Get()
  findAll(@Query() filters: ProductFilterDto) {
    return this.productService.findAll(filters);
  }

  @Get('featured')
  getFeatured() {
    return this.productService.getFeaturedProducts();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Get(':id/related')
  getRelated(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getRelatedProducts(id);
  }
}