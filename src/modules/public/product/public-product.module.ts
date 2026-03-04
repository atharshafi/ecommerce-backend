import { Module } from '@nestjs/common';
import { PublicProductController } from './public-product.controller';
import { PublicProductService } from './public-product.service';
import { PrismaModule } from '../../../prisma/prisma.module';
@Module({
  imports: [PrismaModule],
  controllers: [PublicProductController],
  providers: [PublicProductService],
  exports: [PublicProductService],
})
export class PublicProductModule {}