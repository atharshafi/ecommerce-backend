import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    console.log('PrismaService is initializing');
    await this.$connect();
    console.log('PrismaService connected to the database');
  }

  async onModuleDestroy() {
    console.log('PrismaService is being destroyed');
    await this.$disconnect();
  }
}
