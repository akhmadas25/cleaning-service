import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return new PrismaClient({ log: ["query"] });

  try {
    let config: any;
    try {
      const url = new URL(dbUrl.replace("mysql:", "http:").replace("mysqls:", "https:"));
      config = {
        host: url.hostname,
        port: url.port ? parseInt(url.port) : 3306,
        user: url.username,
        password: decodeURIComponent(url.password),
        database: url.pathname.substring(1).split('?')[0],
      };
    } catch (urlError) {
      // Manual fallback for URLs with special chars in password
      const regex = /mysqls?:\/\/([^:]+):(.+)@([^:/]+)(?::(\d+))?\/([^?]+)/;
      const match = dbUrl.match(regex);
      if (match) {
        const [_, user, password, host, port, database] = match;
        config = {
          host,
          port: port ? parseInt(port) : 3306,
          user,
          password,
          database,
        };
      } else {
        throw urlError;
      }
    }

    const adapter = new PrismaMariaDb({
      ...config,
      connectTimeout: 10000,
      acquireTimeout: 10000,
      ssl: {
        rejectUnauthorized: true,
      },
    });
    return new PrismaClient({ adapter, log: ["query"] });
  } catch (error) {
    console.error("Prisma adapter init error details:", error);
    // In this environment, we MUST return a client with an adapter if using 'client' engine
    // but if we reach here, we are in trouble. We'll return a default client and hope for the best
    // or it will throw a validation error which is better than a generic digest.
    return new PrismaClient({ log: ["query", "error"] });
  }
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
export { prisma as db }; // alias if needed

