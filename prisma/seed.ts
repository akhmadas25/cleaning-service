import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
dotenv.config();

const dbUrl = process.env.DATABASE_URL!;
let adapter: PrismaMariaDb;

try {
  const url = new URL(dbUrl.replace("mysql:", "http:"));
  adapter = new PrismaMariaDb({
    host: url.hostname,
    port: url.port ? parseInt(url.port) : 3306,
    user: url.username,
    password: decodeURIComponent(url.password),
    database: url.pathname.substring(1).split('?')[0],
    connectTimeout: 10000,
    ssl: {
      rejectUnauthorized: true,
    },
  });
} catch (error) {
  console.error("Failed to parse DATABASE_URL for adapter:", error);
  // Fallback to string-based config if URL parsing fails
  adapter = new PrismaMariaDb(dbUrl);
}

const prisma = new PrismaClient({ adapter });

async function main() {
  // ── 1. Admin default ──────────────────────────────────────────────
  console.log("Membuat akun admin default...");
  const hashedPassword = await bcrypt.hash("Admin@123", 12);
  await prisma.user.upsert({
    where: { email: "admin@cleanpro.id" },
    update: {},
    create: {
      name: "Admin CleanPro",
      email: "admin@cleanpro.id",
      hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("✓ Admin: admin@cleanpro.id / Admin@123");

  // ── 2. Harga layanan ──────────────────────────────────────────────
  console.log("\nSeeding harga layanan...");
  const pricingData = [
    { serviceType: "TOILET" as const, basePrice: 50000, pricePerSqm: 0,    pricePerHour: 35000 },
    { serviceType: "RUMPUT" as const, basePrice: 30000, pricePerSqm: 5000,  pricePerHour: 0 },
    { serviceType: "RUANGAN"as const, basePrice: 50000, pricePerSqm: 8000,  pricePerHour: 0 },
    { serviceType: "GUDANG" as const, basePrice: 75000, pricePerSqm: 6000,  pricePerHour: 0 },
  ];
  for (const data of pricingData) {
    await prisma.servicePricing.upsert({
      where: { serviceType: data.serviceType },
      update: data,
      create: data,
    });
    console.log(`✓ ${data.serviceType}: base=Rp${data.basePrice}, /m²=Rp${data.pricePerSqm}, /jam=Rp${data.pricePerHour}`);
  }

  console.log("\n✅ Seeding selesai!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
