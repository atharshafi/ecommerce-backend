import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthModule } from './auth/auth.module';
//import { CategoryModule } from '../category/category.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [AuthModule, ProductModule, CategoryModule]
})
export class AdminModule {}
