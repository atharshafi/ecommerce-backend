import { Module } from '@nestjs/common';
import { PublicCategoryController } from './public-category.controller';
import { PublicCategoryService } from './public-category.service';
import { PrismaModule } from '../../../prisma/prisma.module';
@Module({
  imports: [PrismaModule],
  controllers: [PublicCategoryController],
  providers: [PublicCategoryService],
  exports: [PublicCategoryService],
})
export class PublicCategoryModule {}