import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
  prisma = new PrismaClient({ adapter });
} else {
  if (!globalForPrisma.prisma) {
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
    globalForPrisma.prisma = new PrismaClient({ 
      adapter,
      log: ["query"],
    });
  }
  prisma = globalForPrisma.prisma;
}

export { prisma };
