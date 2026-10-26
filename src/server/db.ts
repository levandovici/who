import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Hostinger injects Atlas credentials under its own env var name (e.g.
// MONGODB_URI); Prisma reads DATABASE_URL — accept either.
const url = process.env.DATABASE_URL ?? process.env.MONGODB_URI;

export const prisma = globalForPrisma.prisma ??= new PrismaClient(
  url ? { datasources: { db: { url } } } : undefined,
);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
