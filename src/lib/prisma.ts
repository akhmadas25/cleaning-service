import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return new PrismaClient({ log: ["query"] });

  try {
    const url = new URL(dbUrl.replace("mysql:", "http:"));
    const adapter = new PrismaMariaDb({
      host: url.hostname,
      port: url.port ? parseInt(url.port) : 3306,
      user: url.username,
      password: decodeURIComponent(url.password),
      database: url.pathname.substring(1).split('?')[0],
      ssl: {
        rejectUnauthorized: true,
      },
    });
    return new PrismaClient({ adapter, log: ["query"] });
  } catch (error) {
    console.error("Prisma adapter init error:", error);
    return new PrismaClient({ log: ["query"] });
  }
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
export { prisma as db }; // alias if needed

