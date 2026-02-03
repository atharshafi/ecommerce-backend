import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.gaurd';
@UseGuards(JwtAuthGuard)
@Controller('admin/categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  // Create category
  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  // Get all categories
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  // Update category
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, dto);
  }
}
