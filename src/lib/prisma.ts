import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient;

if (globalForPrisma.prisma) {
  prismaInstance = globalForPrisma.prisma;
} else {
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    const match = dbUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);
    if (match) {
      const [_, user, password, host, port, database] = match;
      const adapter = new PrismaMariaDb({
        host,
        port: parseInt(port),
        user,
        password,
        database,
        ssl: {
          rejectUnauthorized: true,
        },
      });
      prismaInstance = new PrismaClient({ adapter, log: ["query"] });
    } else {
      prismaInstance = new PrismaClient({ log: ["query"] });
    }
  } else {
    prismaInstance = new PrismaClient({ log: ["query"] });
  }
}

export const prisma = prismaInstance;
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismaInstance;
export { prismaInstance as db }; // alias if needed

