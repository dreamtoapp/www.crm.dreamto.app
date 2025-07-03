import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const updated = await prisma.image.updateMany({
    data: { revisionRequestCount: 0 },
  });
  console.log(`Updated ${updated.count} images with revisionRequestCount = 0`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect()); 