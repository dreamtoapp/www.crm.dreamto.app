import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create only the admin user
  await prisma.user.create({
    data: {
      name: 'مدير النظام',
      role: Role.ADMIN,
      identifier: 'A789',
    },
  });
}

main()
  .then(() => {
    console.log('Seeding complete!');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect();
  }); 