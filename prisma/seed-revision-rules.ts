import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.revisionRule.createMany({
    data: [
      { text: 'يجب أن تكون طلبات التعديل واضحة ومحددة.', order: 1 },
      { text: 'لا يمكن طلب تعديل بعد الموافقة النهائية.', order: 2 },
      { text: 'الحد الأقصى لعدد طلبات التعديل هو 2 لكل تصميم.', order: 3 },
    ],
  });
  console.log('Seeded revision rules!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect()); 