import { PrismaClient, Role } from '@prisma/client';

const prismaClient = new PrismaClient();

export { prismaClient, Role }; 