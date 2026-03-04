import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PublicCategoryService } from './public-category.service';

@Controller('public/categories')
export class PublicCategoryController {
  constructor(private readonly categoryService: PublicCategoryService) {}

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }
}