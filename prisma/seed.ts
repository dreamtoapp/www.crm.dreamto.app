import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

// Fake data generators
const arabicNames = [
  'أحمد محمد',
  'فاطمة علي',
  'عبدالله حسن',
  'مريم أحمد',
  'محمد علي',
  'سارة خالد',
  'علي محمود',
  'نور الدين',
  'خديجة محمد',
  'يوسف أحمد',
  'زينب علي',
  'عمر حسن',
  'آمنة محمد',
  'حسن علي',
  'عائشة أحمد'
];

const englishNames = [
  'Ahmed Mohamed',
  'Fatima Ali',
  'Abdullah Hassan',
  'Mariam Ahmed',
  'Mohamed Ali',
  'Sarah Khalid',
  'Ali Mahmoud',
  'Nour El-Din',
  'Khadija Mohamed',
  'Youssef Ahmed',
  'Zeinab Ali',
  'Omar Hassan',
  'Amina Mohamed',
  'Hassan Ali',
  'Aisha Ahmed'
];

const designTypes = [
  { name: 'تصميم داخلي', description: 'تصميمات للديكور الداخلي للمنازل والمكاتب' },
  { name: 'تصميم خارجي', description: 'تصميمات الواجهات الخارجية للمباني' },
  { name: 'تصميم أثاث', description: 'تصميم قطع الأثاث المخصصة' },
  { name: 'تصميم إضاءة', description: 'تصميم أنظمة الإضاءة والإنارة' },
  { name: 'تصميم حدائق', description: 'تصميم الحدائق والمساحات الخضراء' },
  { name: 'تصميم مطابخ', description: 'تصميم المطابخ الحديثة والكلاسيكية' },
  { name: 'تصميم حمامات', description: 'تصميم الحمامات والمرافق الصحية' },
  { name: 'تصميم غرف نوم', description: 'تصميم غرف النوم والغرف الشخصية' }
];

const englishDesignTypes = [
  { name: 'Interior Design', description: 'Interior decoration designs for homes and offices' },
  { name: 'Exterior Design', description: 'Exterior facade designs for buildings' },
  { name: 'Furniture Design', description: 'Custom furniture piece designs' },
  { name: 'Lighting Design', description: 'Lighting system and illumination designs' },
  { name: 'Garden Design', description: 'Garden and green space designs' },
  { name: 'Kitchen Design', description: 'Modern and classic kitchen designs' },
  { name: 'Bathroom Design', description: 'Bathroom and sanitary facility designs' },
  { name: 'Bedroom Design', description: 'Bedroom and personal room designs' }
];

const sampleComments = [
  'تصميم رائع ومبتكر!',
  'أحب الألوان المستخدمة في هذا التصميم',
  'التفاصيل دقيقة ومميزة',
  'تصميم عصري وأنيق',
  'ممتاز! هذا بالضبط ما كنت أبحث عنه',
  'أقترح تعديل بسيط في الألوان',
  'التصميم عملي ومريح',
  'أداء ممتاز في هذا المشروع',
  'تصميم كلاسيكي جميل',
  'أفكار إبداعية ومبتكرة'
];

const englishComments = [
  'Amazing and innovative design!',
  'I love the colors used in this design',
  'The details are precise and distinctive',
  'Modern and elegant design',
  'Excellent! This is exactly what I was looking for',
  'I suggest a slight modification in colors',
  'Practical and comfortable design',
  'Outstanding performance on this project',
  'Beautiful classic design',
  'Creative and innovative ideas'
];

// Generate working placeholder image URLs
function generateFakeImageUrl(index: number) {
  const width = 800 + (index % 400);
  const height = 600 + (index % 300);
  // Use Picsum Photos for reliable placeholder images
  return `https://picsum.photos/${width}/${height}?random=${index}`;
}

function generateFakePublicId(index: number) {
  return `sample_images/image_${index}_${Date.now()}`;
}

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.comment.deleteMany();
  await prisma.image.deleteMany();
  await prisma.designType.deleteMany();
  await prisma.user.deleteMany();

  // Create Design Types
  console.log('🎨 Creating design types...');
  const createdDesignTypes = [];
  for (let i = 0; i < designTypes.length; i++) {
    const designType = await prisma.designType.create({
      data: {
        name: designTypes[i].name,
        description: designTypes[i].description,
      },
    });
    createdDesignTypes.push(designType);
  }

  // Create Users (Admin, Designers, Clients)
  console.log('👥 Creating users...');
  
  // Create Admin
  const admin = await prisma.user.create({
    data: {
      name: 'مدير النظام',
      role: Role.ADMIN,
      identifier: 'A789',
      email: 'admin@dreamto.app',
    },
  });

  // Create Designers
  const designers = [];
  for (let i = 0; i < 5; i++) {
    const designer = await prisma.user.create({
      data: {
        name: arabicNames[i],
        role: Role.DESIGNER,
        identifier: `D${100 + i}`,
        email: `designer${i + 1}@dreamto.app`,
      },
    });
    designers.push(designer);
  }

  // Create Clients
  const clients = [];
  for (let i = 5; i < 15; i++) {
    const client = await prisma.user.create({
      data: {
        name: arabicNames[i],
        role: Role.CLIENT,
        identifier: `C${200 + (i - 5)}`,
        email: `client${i - 4}@dreamto.app`,
      },
    });
    clients.push(client);
  }

  // Create Images with realistic data
  console.log('🖼️ Creating images...');
  const images = [];
  for (let i = 0; i < 50; i++) {
    const designer = designers[i % designers.length];
    const client = clients[i % clients.length];
    const designType = createdDesignTypes[i % createdDesignTypes.length];
    
    const image = await prisma.image.create({
      data: {
        url: generateFakeImageUrl(i),
        publicId: generateFakePublicId(i),
        uploaderId: designer.id,
        clientId: client.id,
        clientName: client.name,
        designTypeId: designType.id,
        format: 'jpg', // Picsum Photos returns JPG format
        bytes: 500000 + (i * 10000),
        width: 800 + (i % 400),
        height: 600 + (i % 300),
      },
    });
    images.push(image);
  }

  // Create Comments
  console.log('💬 Creating comments...');
  for (let i = 0; i < 100; i++) {
    const image = images[i % images.length];
    const commenter = [admin, ...designers, ...clients][i % (1 + designers.length + clients.length)];
    const commentText = sampleComments[i % sampleComments.length];
    
    await prisma.comment.create({
      data: {
        imageId: image.id,
        authorId: commenter.id,
        content: commentText,
      },
    });
  }

  // Create some additional test scenarios
  console.log('🔧 Creating test scenarios...');
  
  // Create a designer with many images
  const prolificDesigner = await prisma.user.create({
    data: {
      name: 'مصمم نشط',
      role: Role.DESIGNER,
      identifier: 'D999',
      email: 'prolific@dreamto.app',
    },
  });

  // Create images for prolific designer
  for (let i = 0; i < 10; i++) {
    const client = clients[i % clients.length];
    const designType = createdDesignTypes[i % createdDesignTypes.length];
    
    await prisma.image.create({
      data: {
        url: generateFakeImageUrl(100 + i),
        publicId: generateFakePublicId(100 + i),
        uploaderId: prolificDesigner.id,
        clientId: client.id,
        clientName: client.name,
        designTypeId: designType.id,
        format: 'jpg',
        bytes: 800000,
        width: 1200,
        height: 800,
      },
    });
  }

  // Create a client with many images
  const activeClient = await prisma.user.create({
    data: {
      name: 'عميل نشط',
      role: Role.CLIENT,
      identifier: 'C999',
      email: 'activeclient@dreamto.app',
    },
  });

  // Create images for active client
  for (let i = 0; i < 8; i++) {
    const designer = designers[i % designers.length];
    const designType = createdDesignTypes[i % createdDesignTypes.length];
    
    await prisma.image.create({
      data: {
        url: generateFakeImageUrl(200 + i),
        publicId: generateFakePublicId(200 + i),
        uploaderId: designer.id,
        clientId: activeClient.id,
        clientName: activeClient.name,
        designTypeId: designType.id,
        format: 'jpg', // Picsum Photos returns JPG format
        bytes: 600000,
        width: 1000,
        height: 700,
      },
    });
  }

  console.log('✅ Seeding completed successfully!');
  console.log('\n📊 Database Summary:');
  console.log(`- Admin users: 1`);
  console.log(`- Designers: ${designers.length + 1} (including prolific designer)`);
  console.log(`- Clients: ${clients.length + 1} (including active client)`);
  console.log(`- Design Types: ${createdDesignTypes.length}`);
  console.log(`- Images: ${images.length + 18} (including test scenarios)`);
  console.log(`- Comments: 100`);
  
  console.log('\n🔑 Test Credentials:');
  console.log('Admin: A789');
  console.log('Designers: D100, D101, D102, D103, D104, D999 (prolific)');
  console.log('Clients: C200, C201, C202, C203, C204, C205, C206, C207, C208, C209, C999 (active)');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  }); 