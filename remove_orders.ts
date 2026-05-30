import { prisma } from './src/lib/prisma';

async function main() {
  const result = await prisma.order.deleteMany({});
  console.log(`Deleted ${result.count} orders.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
