import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from './auth/auth.module';  // Import AuthModule
import { PrismaModule } from '../../prisma/prisma.module';
@Module({
  imports: [
    PrismaModule, 
    AuthModule,  // AuthModule 
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}