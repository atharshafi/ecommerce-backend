import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);

  await prisma.admin.create({
    data: {
      email: 'admin@woodstore.com',
      password: passwordHash,
    },
  });

  console.log('Admin created');
}

main();
