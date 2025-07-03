import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';
import { Role } from '@prisma/client';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const seedType = searchParams.get('seed');
    const category = searchParams.get('category') || 'design'; // design, press, marketing

    // Clear existing data in correct order (respecting foreign key constraints)
    // First, delete child comments (replies) to break self-referencing relationships
    await db.comment.deleteMany({
      where: {
        parentId: { not: null }
      }
    });
    // Then delete parent comments
    await db.comment.deleteMany();
    await db.revisionRequest.deleteMany();
    await db.image.deleteMany();
    await db.designType.deleteMany();
    await db.user.deleteMany();
    await db.revisionRule.deleteMany();

    if (seedType === 'demo') {
      await seedDemoData(category);
    } else {
      // Create a single admin account for fresh start
      await db.user.create({
        data: {
          name: 'مدير النظام',
          identifier: 'A001',
          email: 'admin@agency.com',
          role: Role.ADMIN,
        },
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Database ${seedType === 'demo' ? 'seeded with ' + category + ' agency data' : 'cleared and admin created'}` 
    });
  } catch (error) {
    console.error('Reset demo error:', error);
    return NextResponse.json(
      { error: 'Failed to reset demo data', details: String(error) }, 
      { status: 500 }
    );
  }
}

async function seedDemoData(category: string) {
  switch (category) {
    case 'press':
      await seedPressAgency();
      break;
    case 'marketing':
      await seedMarketingAgency();
      break;
    case 'webdev':
      await seedWebDevAgency();
      break;
    case 'video':
      await seedVideoAgency();
      break;
    case 'content':
      await seedContentAgency();
      break;
    case 'photo':
      await seedPhotoAgency();
      break;
    case 'events':
      await seedEventsAgency();
      break;
    default:
      await seedDesignAgency();
  }
}

// Press & Advertising Agency Data
async function seedPressAgency() {
  // Project Types for Press Agency
  const pressProjectTypes = [
    { name: 'إعلانات صحفية', description: 'تصميم الإعلانات المطبوعة في الصحف والمجلات' },
    { name: 'إعلانات خارجية', description: 'تصميم اللوحات الإعلانية والبانرات الخارجية' },
    { name: 'إعلانات تلفزيونية', description: 'تصميم الإعلانات التلفزيونية والرسوم المتحركة' },
    { name: 'إعلانات راديو', description: 'كتابة وإنتاج الإعلانات الإذاعية' },
    { name: 'إعلانات رقمية', description: 'إعلانات وسائل التواصل الاجتماعي والويب' },
    { name: 'إعلانات مطبوعات', description: 'تصميم الكتيبات والمنشورات الإعلانية' },
    { name: 'إعلانات معارض', description: 'تصميم أجنحة المعارض والمواد الإعلانية' },
    { name: 'إعلانات سينما', description: 'إعلانات السينما والسيناريوهات الإعلانية' }
  ];

  // Press Agency Team
  const pressTeam = [
    'أحمد الصحفي - مدير إعلانات',
    'فاطمة الإعلامية - مصممة إعلانات',
    'عبدالله المذيع - كاتب إعلانات',
    'مريم المنتجة - مديرة حسابات إعلانية',
    'محمد المصور - مصور إعلانات',
    'سارة المخرجة - مخرجة إعلانات',
    'علي المونتير - مونتير إعلانات',
    'نور المذيع - مذيع إعلانات',
    'خديجة الصحفية - كاتبة إعلانات',
    'يوسف المصمم - مصمم جرافيك إعلاني'
  ];

  // Press Agency Clients
  const pressClients = [
    'صحيفة الوطن اليومية',
    'مجلة الأزياء الحديثة',
    'محطة التلفزيون الوطنية',
    'راديو الشباب',
    'سينما النجوم',
    'معرض السيارات الدولي',
    'شركة الإعلانات الكبرى',
    'وكالة الأنباء المحلية',
    'مجلة الأعمال الاقتصادية',
    'صحيفة الرياضة الأسبوعية',
    'محطة الإذاعة التجارية',
    'سينما العائلة',
    'معرض العقارات السنوي',
    'مجلة الصحة والجمال',
    'صحيفة التكنولوجيا'
  ];

  // Press-specific comments
  const pressComments = [
    'الإعلان جذاب ويصل للجمهور المستهدف بشكل مثالي!',
    'الألوان والخطوط مناسبة للصحافة المطبوعة',
    'هذا الإعلان سيزيد من مبيعات المنتج بنسبة 30%',
    'ممتاز! الإعلان يتبع معايير الصحافة المهنية',
    'أقترح تعديل بسيط في حجم العنوان',
    'الإعلان عملي وسهل الطباعة',
    'هذا بالضبط ما طلبه العميل الصحفي',
    'أداء ممتاز في هذا المشروع الإعلاني',
    'الإعلان يلبي جميع متطلبات الصحيفة',
    'أفكار إبداعية ومبتكرة في الإعلان',
    'الإعلان مناسب للجمهور القراء',
    'ممتاز في التواصل مع رسالة العلامة التجارية',
    'الإعلان احترافي ومقنع',
    'هذا سيعزز من صورة العلامة التجارية',
    'الإعلان متوافق مع معايير الصحافة'
  ];

  await createAgencyData(pressProjectTypes, pressTeam, pressClients, pressComments, 'press');
}

// Marketing Agency Data
async function seedMarketingAgency() {
  // Project Types for Marketing Agency
  const marketingProjectTypes = [
    { name: 'استراتيجية تسويقية', description: 'تطوير استراتيجيات التسويق الشاملة' },
    { name: 'حملات إعلانية', description: 'تصميم وإدارة الحملات الإعلانية المتكاملة' },
    { name: 'تسويق رقمي', description: 'استراتيجيات التسويق الرقمي ووسائل التواصل' },
    { name: 'تسويق المحتوى', description: 'إنشاء وإدارة المحتوى التسويقي' },
    { name: 'تسويق العلامة التجارية', description: 'تطوير هوية العلامة التجارية' },
    { name: 'تسويق المؤثرين', description: 'حملات التسويق عبر المؤثرين' },
    { name: 'تسويق الأحداث', description: 'تسويق وإدارة الأحداث والفعاليات' },
    { name: 'تحليل السوق', description: 'دراسات السوق والتحليل التنافسي' }
  ];

  // Marketing Agency Team
  const marketingTeam = [
    'أحمد التسويقي - مدير تسويق',
    'فاطمة المحللة - محللة تسويق',
    'عبدالله الاستراتيجي - استراتيجي تسويق',
    'مريم الرقمية - مديرة تسويق رقمي',
    'محمد المحتوى - مدير محتوى تسويقي',
    'سارة العلامة - مديرة هوية العلامة التجارية',
    'علي المؤثرين - مدير تسويق المؤثرين',
    'نور الأحداث - مديرة تسويق الأحداث',
    'خديجة التحليل - محللة بيانات تسويقية',
    'يوسف الإبداعي - مدير إبداعي تسويقي'
  ];

  // Marketing Agency Clients
  const marketingClients = [
    'شركة التكنولوجيا المتقدمة',
    'مطعم السلسلة العالمية',
    'صالون التجميل الفاخر',
    'شركة العقارات الكبرى',
    'مستشفى التخصصات الطبية',
    'مدرسة التعليم الدولي',
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

  // Marketing-specific comments
  const marketingComments = [
    'الاستراتيجية التسويقية شاملة ومبتكرة!',
    'التحليل الديموغرافي دقيق ومفيد',
    'هذه الحملة ستزيد المبيعات بنسبة 40%',
    'ممتاز! الاستراتيجية تتبع أحدث الاتجاهات',
    'أقترح تعديل في استهداف الجمهور',
    'الاستراتيجية عملية وقابلة للتنفيذ',
    'هذا بالضبط ما يحتاجه السوق حالياً',
    'أداء ممتاز في تحليل المنافسين',
    'الاستراتيجية تلبي جميع أهداف العمل',
    'أفكار إبداعية في التسويق الرقمي',
    'الاستراتيجية مناسبة للجمهور المستهدف',
    'ممتاز في التواصل مع العلامة التجارية',
    'الاستراتيجية احترافية ومقنعة',
    'هذا سيعزز من حضور العلامة التجارية',
    'الاستراتيجية متوافقة مع معايير الصناعة'
  ];

  await createAgencyData(marketingProjectTypes, marketingTeam, marketingClients, marketingComments, 'marketing');
}

// Design Agency Data (Current)
async function seedDesignAgency() {
  // Current design project types
  const designProjectTypes = [
    { name: 'هوية بصرية', description: 'تصميم الهويات البصرية والشعارات للشركات' },
    { name: 'إعلانات مطبوعة', description: 'تصميم الإعلانات والملصقات المطبوعة' },
    { name: 'وسائل التواصل الاجتماعي', description: 'تصميم محتوى وسائل التواصل الاجتماعي' },
    { name: 'تصميم مواقع الويب', description: 'تصميم واجهات المواقع الإلكترونية' },
    { name: 'تصميم التطبيقات', description: 'تصميم واجهات تطبيقات الهواتف' },
    { name: 'رسوم متحركة', description: 'تصميم الرسوم المتحركة والفيديوهات' },
    { name: 'تصميم المطبوعات', description: 'تصميم الكتب والكتيبات والمنشورات' },
    { name: 'إعلانات رقمية', description: 'تصميم الإعلانات الرقمية والبانرات' }
  ];

  // Current design team
  const designTeam = [
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

  // Current design clients
  const designClients = [
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

  // Current design comments
  const designComments = [
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

  await createAgencyData(designProjectTypes, designTeam, designClients, designComments, 'design');
}

// Web & App Development Agency
async function seedWebDevAgency() {
  const projectTypes = [
    { name: 'موقع تعريفي', description: 'برمجة وتصميم مواقع الشركات والمؤسسات' },
    { name: 'متجر إلكتروني', description: 'تطوير متاجر إلكترونية متكاملة' },
    { name: 'تطبيق جوال', description: 'تصميم وبرمجة تطبيقات الهواتف الذكية' },
    { name: 'لوحة تحكم', description: 'تطوير لوحات تحكم وإدارة للمواقع' },
    { name: 'موقع شخصي', description: 'مواقع شخصية وسير ذاتية احترافية' },
    { name: 'بوابة إلكترونية', description: 'بوابات إلكترونية للجهات الحكومية والتعليمية' }
  ];
  const team = [
    'أحمد المطور - مطور واجهات',
    'فاطمة البرمجية - مطورة باك اند',
    'عبدالله التطبيقات - مطور تطبيقات',
    'مريم الواجهات - مصممة UI/UX',
    'محمد الأنظمة - مهندس نظم',
    'سارة الاختبار - مختبرة جودة',
    'علي الدعم - دعم فني',
    'نور الأمن - مختصة أمن معلومات'
  ];
  const clients = [
    'شركة التقنية الحديثة',
    'مؤسسة التعليم الرقمي',
    'متجر الإلكترونيات الذكية',
    'شركة النقل السريع',
    'مستشفى الصحة الرقمية',
    'بوابة الخدمات الحكومية',
    'شركة البرمجيات المتقدمة',
    'موقع التوظيف العربي'
  ];
  const comments = [
    'الموقع سريع الاستجابة واحترافي!',
    'تصميم التطبيق عصري وسهل الاستخدام',
    'لوحة التحكم متكاملة وسهلة الإدارة',
    'دعم فني ممتاز وسريع',
    'المتجر الإلكتروني زاد من مبيعاتنا',
    'تجربة المستخدم رائعة',
    'الأمان عالي في النظام',
    'تطوير احترافي وموثوق'
  ];
  await createAgencyData(projectTypes, team, clients, comments, 'webdev');
}

// Video Production & Motion Graphics Agency
async function seedVideoAgency() {
  const projectTypes = [
    { name: 'فيديو ترويجي', description: 'إنتاج فيديوهات ترويجية للمنتجات والخدمات' },
    { name: 'موشن جرافيك', description: 'تصميم فيديوهات موشن جرافيك احترافية' },
    { name: 'إعلان تلفزيوني', description: 'إنتاج إعلانات تلفزيونية عالية الجودة' },
    { name: 'مونتاج فيديو', description: 'تحرير ومونتاج الفيديوهات' },
    { name: 'فيديو تعريفي', description: 'فيديوهات تعريفية بالشركات والمؤسسات' },
    { name: 'رسوم متحركة', description: 'تصميم وتحريك الرسوم المتحركة' }
  ];
  const team = [
    'أحمد المخرج - مخرج فيديو',
    'فاطمة الموشن - مصممة موشن جرافيك',
    'عبدالله المصور - مصور فيديو',
    'مريم السيناريو - كاتبة سيناريو',
    'محمد المونتير - محرر فيديو',
    'سارة الصوت - مهندسة صوت',
    'علي الإضاءة - فني إضاءة',
    'نور الإنتاج - مديرة إنتاج'
  ];
  const clients = [
    'شركة المنتجات الحديثة',
    'قناة الإعلام العربي',
    'مؤسسة التعليم المرئي',
    'شركة الإعلانات التلفزيونية',
    'مهرجان الأفلام القصيرة',
    'شركة التسويق البصري',
    'مركز التدريب الإعلامي',
    'مؤسسة الإنتاج الإبداعي'
  ];
  const comments = [
    'الفيديو احترافي ويعبر عن الرسالة بوضوح',
    'الموشن جرافيك جذاب ومبتكر',
    'المونتاج سلس واحترافي',
    'الصوتيات واضحة ومميزة',
    'الإضاءة ممتازة في التصوير',
    'الفيديو نال إعجاب العملاء',
    'السيناريو متقن ومؤثر',
    'إبداع في إنتاج الفيديو'
  ];
  await createAgencyData(projectTypes, team, clients, comments, 'video');
}

// Content & Creative Writing Agency
async function seedContentAgency() {
  const projectTypes = [
    { name: 'مقال إبداعي', description: 'كتابة مقالات إبداعية وتسويقية' },
    { name: 'منشور سوشيال ميديا', description: 'كتابة منشورات وحملات للسوشيال ميديا' },
    { name: 'نص إعلاني', description: 'كتابة نصوص إعلانية مؤثرة' },
    { name: 'تحرير محتوى', description: 'تحرير وتدقيق المحتوى' },
    { name: 'سيناريو فيديو', description: 'كتابة سيناريوهات للفيديوهات' },
    { name: 'دليل إرشادي', description: 'إعداد أدلة إرشادية وتعليمية' }
  ];
  const team = [
    'أحمد الكاتب - كاتب محتوى',
    'فاطمة المحررة - محررة نصوص',
    'عبدالله الإبداعي - كاتب إعلانات',
    'مريم المدققة - مدققة لغوية',
    'محمد السيناريو - كاتب سيناريو',
    'سارة الحملات - مديرة حملات محتوى',
    'علي التحرير - محرر إبداعي',
    'نور الترجمة - مترجمة نصوص'
  ];
  const clients = [
    'شركة التسويق الرقمي',
    'مؤسسة الإعلام الجديد',
    'منصة التعليم الإلكتروني',
    'شركة الإعلانات الإبداعية',
    'موقع الأخبار العربية',
    'شركة النشر الرقمي',
    'مؤسسة التدريب المهني',
    'موقع المحتوى العربي'
  ];
  const comments = [
    'المحتوى إبداعي وجذاب',
    'النصوص الإعلانية مؤثرة وفعالة',
    'التحرير احترافي وخالٍ من الأخطاء',
    'الحملات ناجحة وحققت نتائج ممتازة',
    'السيناريو متقن ومناسب للفيديو',
    'الدليل الإرشادي واضح وسهل الفهم',
    'اللغة قوية وجذابة',
    'تنوع في أساليب الكتابة'
  ];
  await createAgencyData(projectTypes, team, clients, comments, 'content');
}

// Photography Agency
async function seedPhotoAgency() {
  const projectTypes = [
    { name: 'جلسة تصوير منتجات', description: 'تصوير منتجات احترافي للإعلانات والمتاجر' },
    { name: 'تصوير مناسبات', description: 'تصوير مناسبات وحفلات وأعراس' },
    { name: 'تصوير شخصي', description: 'جلسات تصوير شخصية وبورتريه' },
    { name: 'تصوير معماري', description: 'تصوير المباني والمنشآت' },
    { name: 'تصوير أطعمة', description: 'تصوير أطعمة ومأكولات للمطاعم' },
    { name: 'تصوير أزياء', description: 'تصوير أزياء وموضة' }
  ];
  const team = [
    'أحمد المصور - مصور فوتوغرافي',
    'فاطمة العدسة - مصورة مناسبات',
    'عبدالله المنتجات - مصور منتجات',
    'مريم البورتريه - مصورة شخصية',
    'محمد المعماري - مصور معماري',
    'سارة الأطعمة - مصورة أطعمة',
    'علي الإضاءة - فني إضاءة',
    'نور التحرير - محررة صور'
  ];
  const clients = [
    'مطعم الذواقة',
    'شركة الأزياء العالمية',
    'مركز المناسبات الكبرى',
    'شركة العقارات الحديثة',
    'مخبز الحلويات الفاخر',
    'مجلة التصوير العربي',
    'شركة التسويق البصري',
    'مؤسسة الإنتاج الإعلامي'
  ];
  const comments = [
    'الصور احترافية وواضحة',
    'الإضاءة ممتازة في التصوير',
    'تحرير الصور متقن وجذاب',
    'التصوير مناسب للمناسبة',
    'المنتجات تظهر بشكل رائع',
    'التصوير المعماري دقيق',
    'الألوان زاهية وجذابة',
    'تنوع في زوايا التصوير'
  ];
  await createAgencyData(projectTypes, team, clients, comments, 'photo');
}

// Event & Exhibition Management Agency
async function seedEventsAgency() {
  const projectTypes = [
    { name: 'تنظيم مؤتمر', description: 'تنظيم مؤتمرات وفعاليات كبرى' },
    { name: 'معرض تجاري', description: 'تنظيم معارض تجارية وفعاليات تسويقية' },
    { name: 'فعالية إطلاق منتج', description: 'تنظيم فعاليات إطلاق المنتجات الجديدة' },
    { name: 'حفل توزيع جوائز', description: 'تنظيم حفلات توزيع الجوائز والتكريم' },
    { name: 'فعالية خيرية', description: 'تنظيم فعاليات خيرية واجتماعية' },
    { name: 'ورشة عمل', description: 'تنظيم ورش عمل ودورات تدريبية' }
  ];
  const team = [
    'أحمد المنظم - منظم فعاليات',
    'فاطمة المعارض - مديرة معارض',
    'عبدالله اللوجستي - مدير لوجستي',
    'مريم التسويق - مديرة تسويق فعاليات',
    'محمد الديكور - مصمم ديكور فعاليات',
    'سارة العلاقات - مسؤولة علاقات عامة',
    'علي الصوتيات - فني صوتيات',
    'نور الإضاءة - فنية إضاءة'
  ];
  const clients = [
    'شركة المؤتمرات الدولية',
    'مركز المعارض الحديث',
    'شركة المنتجات الجديدة',
    'مؤسسة الجوائز العربية',
    'جمعية الأعمال الخيرية',
    'مركز التدريب المتقدم',
    'شركة التسويق الفعال',
    'مؤسسة الفعاليات الكبرى'
  ];
  const comments = [
    'التنظيم احترافي ودقيق',
    'المعرض ناجح وجذب الكثير من الزوار',
    'الفعالية كانت مميزة وناجحة',
    'التسويق للفعالية ممتاز',
    'الديكور أضفى جواً رائعاً',
    'العلاقات العامة فعالة',
    'الصوتيات والإضاءة ممتازة',
    'إدارة لوجستية محترفة'
  ];
  await createAgencyData(projectTypes, team, clients, comments, 'events');
}

// Generic function to create agency data
async function createAgencyData(
  projectTypes: Array<{name: string, description: string}>,
  team: string[],
  clients: string[],
  comments: string[],
  category: string
) {
  // Create Project Types
  const createdProjectTypes = [];
  for (const projectType of projectTypes) {
    const created = await db.designType.create({
      data: {
        name: projectType.name,
        description: projectType.description,
      },
    });
    createdProjectTypes.push(created);
  }

  // Create Admin
  const admin = await db.user.create({
    data: {
      name: `مدير ${category === 'press' ? 'وكالة الصحافة' : category === 'marketing' ? 'وكالة التسويق' : 'الوكالة الإعلانية'}`,
      role: Role.ADMIN,
      identifier: 'A001',
      email: `director@${category}-agency.com`,
    },
  });

  // Create Designers/Team
  const designers = [];
  for (let i = 0; i < team.length; i++) {
    const designer = await db.user.create({
      data: {
        name: team[i],
        role: Role.DESIGNER,
        identifier: `D${100 + i}`,
        email: `team${i + 1}@${category}-agency.com`,
      },
    });
    designers.push(designer);
  }

  // Create Clients
  const clientUsers = [];
  for (let i = 0; i < clients.length; i++) {
    const client = await db.user.create({
      data: {
        name: clients[i],
        role: Role.CLIENT,
        identifier: `C${200 + i}`,
        email: `client${i + 1}@${category}-client.com`,
      },
    });
    clientUsers.push(client);
  }

  // Create Projects
  const projects = [];
  for (let i = 0; i < 80; i++) {
    const designer = designers[i % designers.length];
    const client = clientUsers[i % clientUsers.length];
    const projectType = createdProjectTypes[i % createdProjectTypes.length];
    
    const project = await db.image.create({
      data: {
        url: generateFakeImageUrl(i, category),
        publicId: generateFakePublicId(i, category),
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

  // Create Comments
  for (let i = 0; i < 150; i++) {
    const project = projects[i % projects.length];
    const commenter = [admin, ...designers, ...clientUsers][i % (1 + designers.length + clientUsers.length)];
    const commentText = comments[i % comments.length];
    
    await db.comment.create({
      data: {
        imageId: project.id,
        authorId: commenter.id,
        content: commentText,
        designerId: project.uploaderId,
        authorRole: commenter.role,
      },
    });
  }

  // Create senior team member
  const seniorMember = await db.user.create({
    data: {
      name: `عضو أول - ${category === 'press' ? 'صحفي مخضرم' : category === 'marketing' ? 'استراتيجي تسويق' : 'مدير إبداعي'}`,
      role: Role.DESIGNER,
      identifier: 'D999',
      email: `senior@${category}-agency.com`,
    },
  });

  // Create projects for senior member
  for (let i = 0; i < 15; i++) {
    const client = clientUsers[i % clientUsers.length];
    const projectType = createdProjectTypes[i % createdProjectTypes.length];
    
    await db.image.create({
      data: {
        url: generateFakeImageUrl(100 + i, category),
        publicId: generateFakePublicId(100 + i, category),
        uploaderId: seniorMember.id,
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

  // Create major client
  const majorClient = await db.user.create({
    data: {
      name: `عميل مميز - ${category === 'press' ? 'صحيفة كبرى' : category === 'marketing' ? 'شركة متعددة الجنسيات' : 'شركة كبرى'}`,
      role: Role.CLIENT,
      identifier: 'C999',
      email: `major@${category}-corporate.com`,
    },
  });

  // Create projects for major client
  for (let i = 0; i < 12; i++) {
    const designer = designers[i % designers.length];
    const projectType = createdProjectTypes[i % createdProjectTypes.length];
    
    await db.image.create({
      data: {
        url: generateFakeImageUrl(200 + i, category),
        publicId: generateFakePublicId(200 + i, category),
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
}

function generateFakeImageUrl(index: number, category: string) {
  const width = 800 + (index % 400);
  const height = 600 + (index % 300);
  return `https://picsum.photos/${width}/${height}?random=${index}&category=${category}`;
}

function generateFakePublicId(index: number, category: string) {
  return `${category}_agency/project_${index}_${Date.now()}`;
} 