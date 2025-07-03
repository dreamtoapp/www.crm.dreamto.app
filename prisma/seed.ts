import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

// Agency team members
const agencyTeam = [
  'أحمد محمد - مدير إبداعي',
  'فاطمة علي - مصممة جرافيك',
  'عبدالله حسن - مصمم ويب',
  'مريم أحمد - مديرة حسابات',
  'محمد علي - مصمم هويات بصرية',
  'سارة خالد - مصممة إعلانات',
  'علي محمود - مصمم وسائل التواصل',
  'نور الدين - مصمم مطبوعات',
  'خديجة محمد - مصممة واجهات',
  'يوسف أحمد - مصمم رسوم متحركة'
];

const englishTeam = [
  'Ahmed Mohamed - Creative Director',
  'Fatima Ali - Graphic Designer',
  'Abdullah Hassan - Web Designer',
  'Mariam Ahmed - Account Manager',
  'Mohamed Ali - Visual Identity Designer',
  'Sarah Khalid - Ad Designer',
  'Ali Mahmoud - Social Media Designer',
  'Nour El-Din - Print Designer',
  'Khadija Mohamed - UI Designer',
  'Youssef Ahmed - Motion Designer'
];

// Agency clients
const agencyClients = [
  'شركة التقنية المتقدمة',
  'مطعم الشرق الأوسط',
  'صالون التجميل الفاخر',
  'شركة العقارات العالمية',
  'مستشفى الأمل التخصصي',
  'مدرسة المستقبل الدولية',
  'شركة النقل السريع',
  'مخبز الحلويات التقليدي',
  'شركة الأثاث الحديث',
  'صالون السيارات الفاخر',
  'شركة التأمين الموثوقة',
  'مطعم المأكولات البحرية',
  'شركة الأزياء العصرية',
  'صالون التجميل النسائي',
  'شركة البناء المتطورة'
];

const englishClients = [
  'Advanced Technology Co.',
  'Middle East Restaurant',
  'Luxury Beauty Salon',
  'Global Real Estate Co.',
  'Hope Specialized Hospital',
  'Future International School',
  'Fast Transport Company',
  'Traditional Sweets Bakery',
  'Modern Furniture Co.',
  'Luxury Car Salon',
  'Trusted Insurance Co.',
  'Seafood Restaurant',
  'Modern Fashion Co.',
  'Women\'s Beauty Salon',
  'Advanced Construction Co.'
];

// Agency project types
const projectTypes = [
  { name: 'هوية بصرية', description: 'تصميم الهويات البصرية والشعارات للشركات' },
  { name: 'إعلانات مطبوعة', description: 'تصميم الإعلانات والملصقات المطبوعة' },
  { name: 'وسائل التواصل الاجتماعي', description: 'تصميم محتوى وسائل التواصل الاجتماعي' },
  { name: 'تصميم مواقع الويب', description: 'تصميم واجهات المواقع الإلكترونية' },
  { name: 'تصميم التطبيقات', description: 'تصميم واجهات تطبيقات الهواتف' },
  { name: 'رسوم متحركة', description: 'تصميم الرسوم المتحركة والفيديوهات' },
  { name: 'تصميم المطبوعات', description: 'تصميم الكتب والكتيبات والمنشورات' },
  { name: 'إعلانات رقمية', description: 'تصميم الإعلانات الرقمية والبانرات' }
];

const englishProjectTypes = [
  { name: 'Visual Identity', description: 'Corporate visual identity and logo design' },
  { name: 'Print Advertising', description: 'Print ads and poster design' },
  { name: 'Social Media', description: 'Social media content design' },
  { name: 'Web Design', description: 'Website interface design' },
  { name: 'App Design', description: 'Mobile app interface design' },
  { name: 'Motion Graphics', description: 'Animation and video design' },
  { name: 'Print Design', description: 'Books, brochures, and publications design' },
  { name: 'Digital Advertising', description: 'Digital ads and banner design' }
];

// Agency-specific comments
const agencyComments = [
  'التصميم رائع ويعبر عن هوية الشركة بشكل مثالي!',
  'الألوان والخطوط متناسقة ومهنية',
  'هذا التصميم سيجذب انتباه العملاء المستهدفين',
  'ممتاز! التصميم عصري ومبتكر',
  'أقترح تعديل بسيط في حجم العناصر',
  'التصميم عملي وسهل التطبيق',
  'هذا بالضبط ما كان يبحث عنه العميل',
  'أداء ممتاز في هذا المشروع',
  'التصميم يلبي جميع متطلبات العلامة التجارية',
  'أفكار إبداعية ومبتكرة في التصميم',
  'التصميم مناسب للجمهور المستهدف',
  'ممتاز في التواصل مع رسالة العلامة التجارية',
  'التصميم احترافي ومقنع',
  'هذا سيعزز من صورة العلامة التجارية',
  'التصميم متوافق مع معايير الصناعة'
];

const englishComments = [
  'The design is excellent and perfectly represents the company identity!',
  'Colors and typography are harmonious and professional',
  'This design will attract the attention of target customers',
  'Excellent! The design is modern and innovative',
  'I suggest a slight modification in element sizes',
  'The design is practical and easy to implement',
  'This is exactly what the client was looking for',
  'Outstanding performance on this project',
  'The design meets all brand requirements',
  'Creative and innovative ideas in the design',
  'The design is suitable for the target audience',
  'Excellent communication with the brand message',
  'The design is professional and convincing',
  'This will enhance the brand image',
  'The design complies with industry standards'
];

// Generate working placeholder image URLs
function generateFakeImageUrl(index: number) {
  const width = 800 + (index % 400);
  const height = 600 + (index % 300);
  // Use Picsum Photos for reliable placeholder images
  return `https://picsum.photos/${width}/${height}?random=${index}`;
}

function generateFakePublicId(index: number) {
  return `agency_projects/project_${index}_${Date.now()}`;
}

async function main() {
  console.log('🌱 Starting advertising agency database seeding...');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.comment.deleteMany();
  await prisma.image.deleteMany();
  await prisma.designType.deleteMany();
  await prisma.user.deleteMany();

  // Create Project Types (Design Types)
  console.log('🎨 Creating project types...');
  const createdProjectTypes = [];
  for (let i = 0; i < projectTypes.length; i++) {
    const projectType = await prisma.designType.create({
      data: {
        name: projectTypes[i].name,
        description: projectTypes[i].description,
      },
    });
    createdProjectTypes.push(projectType);
  }

  // Create Users (Admin, Designers, Clients)
  console.log('👥 Creating agency team and clients...');
  
  // Create Admin (Agency Director)
  const admin = await prisma.user.create({
    data: {
      name: 'مدير الوكالة الإعلانية',
      role: Role.ADMIN,
      identifier: 'A789',
      email: 'director@advertising-agency.com',
    },
  });

  // Create Designers (Agency Team)
  const designers = [];
  for (let i = 0; i < 10; i++) {
    const designer = await prisma.user.create({
      data: {
        name: agencyTeam[i],
        role: Role.DESIGNER,
        identifier: `D${100 + i}`,
        email: `designer${i + 1}@advertising-agency.com`,
      },
    });
    designers.push(designer);
  }

  // Create Clients (Agency Clients)
  const clients = [];
  for (let i = 0; i < 15; i++) {
    const client = await prisma.user.create({
      data: {
        name: agencyClients[i],
        role: Role.CLIENT,
        identifier: `C${200 + i}`,
        email: `client${i + 1}@business.com`,
      },
    });
    clients.push(client);
  }

  // Create Projects (Images) with realistic agency data
  console.log('🖼️ Creating agency projects...');
  const projects = [];
  for (let i = 0; i < 80; i++) {
    const designer = designers[i % designers.length];
    const client = clients[i % clients.length];
    const projectType = createdProjectTypes[i % createdProjectTypes.length];
    
    const project = await prisma.image.create({
      data: {
        url: generateFakeImageUrl(i),
        publicId: generateFakePublicId(i),
        uploaderId: designer.id,
        clientId: client.id,
        clientName: client.name,
        designTypeId: projectType.id,
        format: 'jpg',
        bytes: 500000 + (i * 10000),
        width: 800 + (i % 400),
        height: 600 + (i % 300),
        status: ['PENDING', 'APPROVED', 'REJECTED', 'REVISION_REQUESTED'][i % 4] as any,
      },
    });
    projects.push(project);
  }

  // Create Comments (Client Feedback)
  console.log('💬 Creating client feedback...');
  for (let i = 0; i < 150; i++) {
    const project = projects[i % projects.length];
    const commenter = [admin, ...designers, ...clients][i % (1 + designers.length + clients.length)];
    const commentText = agencyComments[i % agencyComments.length];
    
    await prisma.comment.create({
      data: {
        imageId: project.id,
        authorId: commenter.id,
        content: commentText,
      },
    });
  }

  // Create additional test scenarios
  console.log('🔧 Creating test scenarios...');
  
  // Create a senior designer with many projects
  const seniorDesigner = await prisma.user.create({
    data: {
      name: 'مصمم أول - مدير إبداعي',
      role: Role.DESIGNER,
      identifier: 'D999',
      email: 'senior@advertising-agency.com',
    },
  });

  // Create projects for senior designer
  for (let i = 0; i < 15; i++) {
    const client = clients[i % clients.length];
    const projectType = createdProjectTypes[i % createdProjectTypes.length];
    
    await prisma.image.create({
      data: {
        url: generateFakeImageUrl(100 + i),
        publicId: generateFakePublicId(100 + i),
        uploaderId: seniorDesigner.id,
        clientId: client.id,
        clientName: client.name,
        designTypeId: projectType.id,
        format: 'jpg',
        bytes: 800000,
        width: 1200,
        height: 800,
        status: 'APPROVED',
      },
    });
  }

  // Create a major client with many projects
  const majorClient = await prisma.user.create({
    data: {
      name: 'شركة كبرى - عميل مميز',
      role: Role.CLIENT,
      identifier: 'C999',
      email: 'major@corporate.com',
    },
  });

  // Create projects for major client
  for (let i = 0; i < 12; i++) {
    const designer = designers[i % designers.length];
    const projectType = createdProjectTypes[i % createdProjectTypes.length];
    
    await prisma.image.create({
      data: {
        url: generateFakeImageUrl(200 + i),
        publicId: generateFakePublicId(200 + i),
        uploaderId: designer.id,
        clientId: majorClient.id,
        clientName: majorClient.name,
        designTypeId: projectType.id,
        format: 'jpg',
        bytes: 600000,
        width: 1000,
        height: 700,
        status: ['PENDING', 'APPROVED'][i % 2] as any,
      },
    });
  }

  console.log('✅ Advertising agency seeding completed successfully!');
  console.log('\n📊 Agency Database Summary:');
  console.log(`- Agency Director: 1`);
  console.log(`- Design Team: ${designers.length + 1} (including senior designer)`);
  console.log(`- Clients: ${clients.length + 1} (including major client)`);
  console.log(`- Project Types: ${createdProjectTypes.length}`);
  console.log(`- Projects: ${projects.length + 27} (including test scenarios)`);
  console.log(`- Client Feedback: 150`);
  
  console.log('\n🎨 Project Types Available:');
  projectTypes.forEach((type, index) => {
    console.log(`  ${index + 1}. ${type.name} - ${type.description}`);
  });
  
  console.log('\n🔑 Test Credentials:');
  console.log('Agency Director: A789');
  console.log('Design Team: D100-D109, D999 (senior)');
  console.log('Clients: C200-C214, C999 (major)');
  
  console.log('\n💼 Agency Workflow:');
  console.log('1. Clients submit project requests');
  console.log('2. Design team creates concepts');
  console.log('3. Clients review and provide feedback');
  console.log('4. Projects are approved, rejected, or revised');
  console.log('5. Final deliverables are prepared');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Agency seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  }); 