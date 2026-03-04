import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { PublicProductModule } from './product/public-product.module';
import { PublicCategoryModule } from './category/public-category.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    PublicProductModule,
    PublicCategoryModule,
    CartModule,
    OrderModule,
  ],
  controllers: [PublicController],
})
export class PublicModule {}