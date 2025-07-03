import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const updated = await prisma.user.updateMany({
    data: { revisionRulesConfirmed: false },
  });
  console.log(`Updated ${updated.count} users with revisionRulesConfirmed = false`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect()); 