import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

(async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful');
  } catch (err) {
    console.error('❌ Database connection failed:', err);
  } finally {
    await prisma.$disconnect();
  }
})(); 