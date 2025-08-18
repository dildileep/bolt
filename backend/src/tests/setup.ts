import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/skillmatrix_test',
    },
  },
});

beforeAll(async () => {
  // Connect to test database
  await prisma.$connect();
});

afterAll(async () => {
  // Clean up and disconnect
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Clean up database before each test
  await prisma.userSkill.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.training.deleteMany();
  await prisma.report.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.user.deleteMany();
});

export { prisma };