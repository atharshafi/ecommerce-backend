import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './modules/admin/admin.module';
import { UserModule } from './modules/user/user.module';
import { HealthController } from './health/health.controller';
import { AdminController } from './modules/admin/admin.controller';
import { PrismaModule } from './prisma/prisma.module';

import { ProductModule } from './modules/admin/product/product.module';
import { PublicModule } from './modules/public/public.module';

@Module({
  imports: [AdminModule, UserModule, PrismaModule, ProductModule, PublicModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
  