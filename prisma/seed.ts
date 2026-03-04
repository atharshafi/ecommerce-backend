import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.admin.create({
    data: {
      email: 'admin@woodcraft.com',
      password: hashedPassword,
    },
  });
  console.log('✅ Admin created');

  // Create Categories
  await prisma.category.createMany({
    data: [
      { name: 'Chairs' },
      { name: 'Tables' },
      { name: 'Beds' },
      { name: 'Sofas' },
      { name: 'Cabinets' },
    ],
  });
  console.log('✅ Categories created');

  // Get category IDs
  const categories = await prisma.category.findMany();

  // Create Products
  await prisma.product.createMany({
    data: [
      {
        name: 'Oak Dining Chair',
        description: 'Solid oak dining chair with comfortable cushion',
        price: 249.99,
        stock: 50,
        woodType: 'Oak',
        categoryId: categories[0].id,
      },
      {
        name: 'Teak Lounge Chair',
        description: 'Premium teak lounge chair for living room',
        price: 349.99,
        stock: 30,
        woodType: 'Teak',
        categoryId: categories[0].id,
      },
      {
        name: 'Walnut Office Chair',
        description: 'Ergonomic office chair made from walnut',
        price: 299.99,
        stock: 25,
        woodType: 'Walnut',
        categoryId: categories[0].id,
      },
      {
        name: 'Oak Dining Table',
        description: '6-seater solid oak dining table',
        price: 899.99,
        stock: 20,
        woodType: 'Oak',
        categoryId: categories[1].id,
      },
      {
        name: 'Teak Coffee Table',
        description: 'Rectangular teak coffee table',
        price: 299.99,
        stock: 35,
        woodType: 'Teak',
        categoryId: categories[1].id,
      },
      {
        name: 'King Size Oak Bed',
        description: 'Solid oak king size bed frame',
        price: 1299.99,
        stock: 10,
        woodType: 'Oak',
        categoryId: categories[2].id,
      },
    ],
  });
  console.log('✅ Products created');

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });