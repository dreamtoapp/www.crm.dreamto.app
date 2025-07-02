import { PrismaClient, Role, DesignType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create users
  const admin = await prisma.user.create({
    data: {
      name: 'مدير النظام',
      role: Role.ADMIN,
      identifier: 'A789',
    },
  });

  const designer = await prisma.user.create({
    data: {
      name: 'مصمم تجريبي',
      role: Role.DESIGNER,
      identifier: 'D456',
    },
  });

  const client = await prisma.user.create({
    data: {
      name: 'عميل تجريبي',
      role: Role.CLIENT,
      identifier: 'C123',
    },
  });

  // Create an image for the client, uploaded by the designer
  await prisma.image.create({
    data: {
      url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      publicId: 'sample',
      uploaderId: designer.id,
      clientName: client.name,
      designType: DesignType.LOGO,
      comments: {
        create: [
          {
            content: 'تصميم رائع!',
            authorId: client.id,
          },
        ],
      },
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