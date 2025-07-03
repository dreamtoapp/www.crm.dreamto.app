'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  GalleryHorizontalIcon, 
  MessageCircleIcon, 
  BellIcon, 
  ShieldCheckIcon, 
  UsersIcon, 
  RocketIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  StarIcon,
  TrendingUpIcon,
  ClockIcon,
  ZapIcon,
  CodeIcon,
  CameraIcon,
  VideoIcon,
  BookOpenIcon,
  CalendarIcon
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

function FeatureCard({ icon, title, desc, delay = 0 }: { 
  icon: React.ReactNode; 
  title: string; 
  desc: string; 
  delay?: number;
}) {
  return (
    <div 
      className="group relative overflow-hidden animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
      <div className="relative backdrop-blur-sm rounded-3xl p-8 border border-border/20 hover:border-border/40 transition-all duration-500 group-hover:-translate-y-2">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary to-accent rounded-full opacity-20 blur group-hover:opacity-40 transition-all duration-300"></div>
            <div className="relative bg-primary/10 p-4 rounded-2xl group-hover:bg-primary/20 transition-colors duration-300">
              <div className="text-primary group-hover:text-accent transition-colors duration-300 group-hover:scale-110 transform">
                {icon}
              </div>
            </div>
          </div>
          <div className="text-center">
            <h3 className="font-bold text-foreground text-xl mb-3 group-hover:text-primary transition-colors duration-300">{title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({ quote, author, role, delay = 0 }: {
  quote: string;
  author: string;
  role: string;
  delay?: number;
}) {
  return (
    <div 
      className="group relative animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-15 group-hover:opacity-25 transition duration-500"></div>
      <div className="relative backdrop-blur-sm rounded-2xl p-6 border border-border/20 hover:border-border/40 transition-all duration-300 group-hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
        <div className="relative z-10">
          <div className="flex items-start gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="size-4 text-chart-4 fill-current group-hover:scale-110 transition-transform duration-300" style={{ transitionDelay: `${i * 50}ms` }} />
            ))}
          </div>
          <blockquote className="text-foreground/90 text-sm leading-relaxed mb-6 italic font-medium">
            "{quote}"
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-30"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-primary-foreground font-bold shadow-lg">
                {author.charAt(0)}
              </div>
            </div>
            <div>
              <div className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors duration-300">{author}</div>
              <div className="text-muted-foreground text-xs">{role}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ icon, number, label, delay = 0 }: {
  icon: React.ReactNode;
  number: string;
  label: string;
  delay?: number;
}) {
  return (
    <div 
      className="relative group animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
      <div className="relative backdrop-blur-sm rounded-2xl p-6 border border-border/20 hover:border-border/40 transition-all duration-300 group-hover:-translate-y-1">
        <div className="text-primary mb-3 flex justify-center group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-2">{number}</div>
        <div className="text-muted-foreground text-sm font-medium">{label}</div>
      </div>
    </div>
  );
}

// Enhanced Circular Progress Bar Component
function CircularProgressBar({ progress }: { progress: number }) {
  const circumference = 2 * Math.PI * 28; // r = 28
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg className="w-16 h-16 drop-shadow-lg" viewBox="0 0 64 64">
        {/* Background circle */}
        <circle
          className="opacity-20"
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          className="opacity-90 transition-all duration-300 ease-out"
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="#06b6d4" // Tailwind cyan-500
          strokeWidth="8"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 6px #06b6d4)' }}
          transform="rotate(-90 32 32)"
        />
      </svg>
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-extrabold text-accent-foreground drop-shadow-sm">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}

const categories = [
  {
    key: 'design',
    label: 'وكالة تصميم',
    icon: <GalleryHorizontalIcon className="w-6 h-6 text-primary" />,
    desc: 'تصميم جرافيك، شعارات، هويات بصرية، مطبوعات.'
  },
  {
    key: 'press',
    label: 'وكالة صحافة وإعلانات',
    icon: <BellIcon className="w-6 h-6 text-yellow-500" />,
    desc: 'إعلانات صحفية، حملات إعلامية، لوحات إعلانية.'
  },
  {
    key: 'marketing',
    label: 'وكالة تسويق',
    icon: <TrendingUpIcon className="w-6 h-6 text-green-500" />,
    desc: 'تسويق رقمي، حملات إعلانية، إدارة محتوى.'
  },
  {
    key: 'webdev',
    label: 'وكالة تطوير مواقع وتطبيقات',
    icon: <CodeIcon className="w-6 h-6 text-blue-500" />,
    desc: 'برمجة وتصميم مواقع وتطبيقات احترافية.'
  },
  {
    key: 'video',
    label: 'وكالة إنتاج فيديو وموشن جرافيك',
    icon: <VideoIcon className="w-6 h-6 text-red-500" />,
    desc: 'فيديوهات ترويجية، موشن جرافيك، مونتاج.'
  },
  {
    key: 'content',
    label: 'وكالة إدارة محتوى وكتابة إبداعية',
    icon: <BookOpenIcon className="w-6 h-6 text-purple-500" />,
    desc: 'كتابة محتوى، تحرير، حملات إبداعية.'
  },
  {
    key: 'photo',
    label: 'وكالة تصوير فوتوغرافي',
    icon: <CameraIcon className="w-6 h-6 text-pink-500" />,
    desc: 'تصوير منتجات، مناسبات، جلسات تصوير.'
  },
  {
    key: 'events',
    label: 'وكالة تنظيم فعاليات ومعارض',
    icon: <CalendarIcon className="w-6 h-6 text-cyan-500" />,
    desc: 'تنظيم مؤتمرات، معارض، فعاليات إطلاق.'
  }
];

export default function ClearLandingPage() {
  const [loading, setLoading] = useState<'none' | 'fresh' | 'seed'>('none');
  const [category, setCategory] = useState<'design' | 'press' | 'marketing' | 'webdev' | 'video' | 'content' | 'photo' | 'events'>('design');
  const [progress, setProgress] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();

  // Progress simulation logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (loading === 'seed') {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval!);
            return 95;
          }
          // Slower as it approaches 95%
          const inc = prev < 80 ? Math.random() * 8 + 3 : Math.random() * 2 + 1;
          return Math.min(prev + inc, 95);
        });
      }, 200);
    } else {
      setProgress(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);

  const handleReset = async (seedDemo: boolean) => {
    setLoading(seedDemo ? 'seed' : 'fresh');
    try {
      const url = seedDemo
        ? `/api/reset-demo?seed=demo&category=${category}`
        : '/api/reset-demo';
      const res = await fetch(url, { method: 'POST' });
      // When API finishes, set progress to 100% and wait a moment before redirect
      if (seedDemo) {
        setProgress(100);
        setTimeout(() => {
          router.push('/');
        }, 400);
      } else if (res.ok) {
        router.push('/?fresh=1');
      } else {
        alert('حدث خطأ أثناء إعادة التهيئة');
      }
    } catch {
      alert('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      if (!seedDemo) setLoading('none');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10 relative overflow-hidden" dir="rtl">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      
      {/* Floating Shapes */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Navigation */}
      <div className="relative z-10 p-4 sm:p-6">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <Link 
            href="/" 
            className="bg-card/90 backdrop-blur-md border border-border/50 rounded-full px-6 py-3 text-sm font-medium text-foreground hover:bg-accent/50 transition-all duration-300 shadow-lg hover:shadow-xl group"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-300 inline-block">←</span> العودة للرئيسية
          </Link>
          <div className="text-xs text-muted-foreground bg-card/50 backdrop-blur-sm px-3 py-1 rounded-full border border-border/30">
            نسخة تجريبية مجانية
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center mb-20 animate-fade-in">
          {/* Enhanced Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute -inset-6 bg-gradient-to-r from-primary via-accent to-primary rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-all duration-700 animate-pulse"></div>
              <div className="relative backdrop-blur-md rounded-2xl p-6 border border-border/20 hover:border-border/40 transition-colors duration-300">
                <img src="/dta.svg" alt="Logo" className="w-16 h-16 drop-shadow-lg" />
              </div>
            </div>
          </div>
          
          {/* Enhanced Title */}
          <div className="mb-8">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-4 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary bg-300% animate-gradient">
                منصة معرض العملاء
              </span>
            </h1>
            <div className="flex justify-center">
              <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-accent to-primary rounded-full shadow-lg"></div>
            </div>
          </div>
          
          {/* Enhanced Subtitle */}
          <div className="relative">
            <p className="text-xl sm:text-2xl lg:text-3xl text-foreground/90 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
              <span className="bg-gradient-to-r from-primary/20 to-accent/20 px-4 py-2 rounded-lg border border-border/30 backdrop-blur-sm">
                حل مشاكل التصميم الحقيقية: توفير <span className="font-bold text-primary">8 أيام</span> من عملية الموافقة التقليدية وتقليل التعديلات بنسبة <span className="font-bold text-accent">67%</span>
              </span>
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <StatsCard 
              icon={<TrendingUpIcon className="size-6" />}
              number="8 أيام"
              label="توفير في وقت الموافقة"
              delay={200}
            />
            <StatsCard 
              icon={<ClockIcon className="size-6" />}
              number="67%"
              label="تقليل التعديلات المتكررة"
              delay={400}
            />
            <StatsCard 
              icon={<ZapIcon className="size-6" />}
              number="75%"
              label="تحسن في رضا العملاء"
              delay={600}
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8 animate-fade-in">
            حلول حقيقية لمشاكل حقيقية في عالم التصميم
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-4xl mx-auto">
            62% من فرق التصميم تواجه مشاكل في عملية الموافقة تريد حلها. نحن نحل هذه المشاكل بطريقة علمية ومدروسة.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<GalleryHorizontalIcon className="size-8" />} 
              title="توفير التكاليف" 
              desc="تقليل تكلفة المراجعات بنسبة 40% وتوفير ساعات العمل المهدرة في البحث عن الملفات والإصدارات."
              delay={0}
            />
            <FeatureCard 
              icon={<MessageCircleIcon className="size-8" />} 
              title="تقليل التعديلات" 
              desc="نظام تعليقات ذكي يقلل من سوء الفهم ويمنع التعديلات المتكررة التي تكلف الوكالات آلاف الدولارات."
              delay={100}
            />
            <FeatureCard 
              icon={<BellIcon className="size-8" />} 
              title="تسريع الإنتاج" 
              desc="زيادة سرعة الإنتاج بنسبة 45% من خلال تنظيم سير العمل وتقليل الوقت المهدر في المتابعات."
              delay={200}
            />
            <FeatureCard 
              icon={<ShieldCheckIcon className="size-8" />} 
              title="تحكم في النسخ" 
              desc="لا مزيد من ملفات 'النسخة_النهائية_النهائية_3'. نظام إدارة نسخ احترافي يوفر الوقت والجهد."
              delay={300}
            />
          </div>
        </div>

        {/* Problem & Solution Section */}
        <div className="mb-16 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="backdrop-blur-sm rounded-3xl p-8 border border-border/20 hover:border-border/30 transition-colors duration-300">
            <h2 className="text-3xl font-bold text-center text-foreground mb-8">
              المشاكل الحقيقية التي نحلها
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-destructive mb-4">❌ المشاكل الشائعة</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground text-sm">المصمم يقضي 3-5 ساعات أسبوعياً في البحث عن النسخة الصحيحة</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground text-sm">العميل يطلب 5-8 تعديلات متكررة بسبب سوء الفهم</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground text-sm">الوكالة تخسر 15-20% من الأرباح بسبب الوقت المهدر</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground text-sm">تأخير المشاريع 2-3 أسابيع بسبب عدم وضوح التعليقات</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-success mb-4">✅ حلولنا المثبتة</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground text-sm">نظام إدارة نسخ تلقائي يوفر 80% من وقت البحث</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground text-sm">تعليقات مرئية دقيقة تقلل التعديلات بنسبة 67%</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground text-sm">زيادة الأرباح بنسبة 25% من خلال تحسين الكفاءة</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground text-sm">تسليم المشاريع في الوقت المحدد بنسبة 95%</p>
                  </div>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-center text-foreground mb-6">
              مصممة خصيصاً للفرق التي تقدر الوقت والجودة
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center group">
                <div className="bg-gradient-to-br from-primary to-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <UsersIcon className="size-8 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-foreground mb-2">وكالات التصميم</h3>
                <p className="text-muted-foreground text-sm">توفير 15-25% من تكاليف التشغيل</p>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-chart-1 to-chart-2 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <RocketIcon className="size-8 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-foreground mb-2">الشركات الناشئة</h3>
                <p className="text-muted-foreground text-sm">تسريع وقت الوصول للسوق</p>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-chart-3 to-chart-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheckIcon className="size-8 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-foreground mb-2">فرق التسويق</h3>
                <p className="text-muted-foreground text-sm">تحسين ROI الحملات الإعلانية</p>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-chart-5 to-success rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircleIcon className="size-8 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-foreground mb-2">المصممين المستقلين</h3>
                <p className="text-muted-foreground text-sm">زيادة الدخل بـ 40% سنوياً</p>
              </div>
            </div>
          </div>
        </div>

        {/* How it works Section */}
        <div className="mb-16 animate-fade-in" style={{ animationDelay: '600ms' }}>
          <div className="backdrop-blur-sm rounded-3xl p-8 border border-border/20 hover:border-border/30 transition-colors duration-300">
            <h2 className="text-3xl font-bold text-center text-foreground mb-8">
              كيف نوفر لك 8 أيام من عملية الموافقة؟
            </h2>
            <div className="space-y-6">
              {[
                { 
                  step: 1, 
                  title: "رفع ذكي للتصاميم", 
                  desc: "نظام تلقائي لإدارة النسخ والإصدارات - لا مزيد من 'النسخة_النهائية_النهائية_3.psd'",
                  savings: "توفير 2-3 ساعات أسبوعياً"
                },
                { 
                  step: 2, 
                  title: "مشاركة فورية ومنظمة", 
                  desc: "روابط آمنة مع صلاحيات محددة - العميل يرى فقط ما يحتاج لرؤيته",
                  savings: "تقليل الأخطاء بنسبة 85%"
                },
                { 
                  step: 3, 
                  title: "تعليقات مرئية دقيقة", 
                  desc: "تعليقات مباشرة على التصميم مع إحداثيات دقيقة - لا مزيد من 'غير اللون الأزرق شوية'",
                  savings: "تقليل التعديلات بنسبة 67%"
                },
                { 
                  step: 4, 
                  title: "نظام موافقات ذكي", 
                  desc: "تتبع حالة كل تعليق وموافقة مع إشعارات تلقائية للفريق",
                  savings: "تسريع الموافقة بـ 5 أيام"
                },
                { 
                  step: 5, 
                  title: "تقارير وتحليلات", 
                  desc: "قياس الأداء وتحديد نقاط التحسين لتطوير سير العمل باستمرار",
                  savings: "زيادة الإنتاجية بـ 45%"
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4 group">
                  <div className="bg-gradient-to-br from-primary to-accent rounded-full w-12 h-12 flex items-center justify-center text-primary-foreground font-bold group-hover:scale-110 transition-transform duration-300">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{item.desc}</p>
                    <div className="text-xs text-success font-medium bg-success/10 px-2 py-1 rounded-md inline-block">
                      💰 {item.savings}
                    </div>
                  </div>
                  <ArrowRightIcon className="size-5 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-16 animate-fade-in" style={{ animationDelay: '800ms' }}>
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            نتائج حقيقية من عملاء حقيقيين
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            الأرقام لا تكذب - هذه هي النتائج التي حققها عملاؤنا بعد استخدام المنصة
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestimonialCard 
              quote="وفرنا 18 ساعة أسبوعياً من الوقت المهدر في البحث عن الملفات والتعديلات. زادت أرباحنا بنسبة 32% في 6 أشهر!"
              author="أحمد محمد"
              role="مدير إبداعي، وكالة التصميم الحديث"
              delay={0}
            />
            <TestimonialCard 
              quote="قبل المنصة كان العميل يطلب 8-10 تعديلات لكل مشروع. الآن المتوسط 2-3 تعديلات فقط. دخلي زاد 45% كمستقلة!"
              author="سارة أحمد"
              role="مصممة جرافيك مستقلة"
              delay={100}
            />
            <TestimonialCard 
              quote="تسليم المشاريع في الوقت المحدد أصبح 95% بدلاً من 60%. فريق التسويق أصبح أكثر كفاءة بـ 3 أضعاف."
              author="محمد العلي"
              role="مدير تسويق، شركة النور"
              delay={200}
            />
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="relative animate-fade-in" style={{ animationDelay: '1000ms' }}>
          <div className="absolute -inset-4 bg-gradient-to-r from-primary via-accent to-primary rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
          <div className="relative backdrop-blur-md rounded-3xl p-12 border border-border/20 hover:border-border/30 transition-colors duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
            <div className="relative z-10 flex justify-center items-center w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl w-full mx-auto">
                {/* Seed Demo Data Card */}
                <button
                  onClick={() => handleReset(true)}
                  disabled={loading === 'fresh' || loading === 'seed'}
                  className="group relative overflow-hidden text-center p-8 rounded-3xl bg-gradient-to-br from-accent/80 to-accent/60 text-accent-foreground shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:scale-100 border border-accent/20"
                  style={{ minWidth: '320px', minHeight: '420px' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/90 to-accent/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent to-primary rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                  <div className="relative z-10 flex flex-col items-center justify-center h-full">
                    <div className="mb-6 flex items-center justify-center">
                      {loading === 'seed' ? (
                        <CircularProgressBar progress={progress} />
                      ) : (
                        <ZapIcon className="size-10 text-accent" />
                      )}
                    </div>
                    <h3 className="font-bold text-2xl mb-2 text-center">
                      {category === 'design' && 'تهيئة بيانات وكالة تصميم'}
                      {category === 'press' && 'تهيئة بيانات وكالة صحافة وإعلانات'}
                      {category === 'marketing' && 'تهيئة بيانات وكالة تسويق'}
                    </h3>
                    <p className="text-accent-foreground/90 text-base mb-4 text-center">
                      {category === 'design' && 'استكشف المنصة مع بيانات وكالة تصميم كاملة'}
                      {category === 'press' && 'استكشف المنصة مع بيانات وكالة صحافة وإعلانات كاملة'}
                      {category === 'marketing' && 'استكشف المنصة مع بيانات وكالة تسويق كاملة'}
                    </p>
                    <div className="bg-accent-foreground/20 px-3 py-1 rounded-full text-xs font-medium mb-4">
                      {loading === 'seed' ? 'جاري التحضير...' : 
                        category === 'design' ? 'وكالة تصميم' :
                        category === 'press' ? 'وكالة صحافة' :
                        'وكالة تسويق'
                      }
                    </div>
                    {/* Grid of cards for agency category selection */}
                    <div className="flex flex-col gap-4 mt-6">
                      {categories.slice(0, 3).map(cat => (
                        <label
                          key={cat.key}
                          className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${category === cat.key ? 'border-primary bg-primary/10 shadow-lg' : 'border-border bg-background hover:bg-accent/30'}`}
                          onClick={() => setCategory(cat.key as any)}
                          style={{ userSelect: 'none' }}
                        >
                          <div>{cat.icon}</div>
                          <div className="flex-1">
                            <div className="font-bold text-lg mb-1">{cat.label}</div>
                            <div className="text-sm text-muted-foreground">{cat.desc}</div>
                          </div>
                          <input
                            type="radio"
                            name="agencyType"
                            value={cat.key}
                            checked={category === cat.key}
                            onChange={() => setCategory(cat.key as any)}
                            className="form-radio accent-primary size-5"
                            style={{ pointerEvents: 'none' }}
                          />
                        </label>
                      ))}
                      <button
                        type="button"
                        className="flex items-center justify-center p-4 rounded-xl border border-border bg-background hover:bg-accent/30 transition-all font-bold text-primary text-lg"
                        onClick={() => setShowAll(true)}
                      >
                        عرض المزيد
                      </button>
                    </div>
                  </div>
                </button>
                {/* Fresh Start Card */}
                <button
                  onClick={() => handleReset(false)}
                  disabled={loading === 'fresh' || loading === 'seed'}
                  className="group relative overflow-hidden text-center p-8 rounded-3xl bg-gradient-to-br from-secondary/80 to-secondary/60 text-secondary-foreground shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:scale-100 border border-secondary/20"
                  style={{ minWidth: '320px', minHeight: '420px' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/90 to-secondary/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-secondary to-muted rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                  <div className="relative z-10 flex flex-col items-center justify-center h-full">
                    {/* Rocket Icon */}
                    <div className="mb-6 flex items-center justify-center">
                      <RocketIcon className="size-12 text-secondary drop-shadow-lg" />
                    </div>
                    <h3 className="font-bold text-2xl mb-2 text-center">بدء تجربة فارغة</h3>
                    <div className="text-secondary-foreground/80 text-base mb-2 text-center font-semibold">أنشئ معرضك الخاص من البداية</div>
                    <p className="text-secondary-foreground/90 text-sm mb-6 text-center leading-relaxed">
                      أضف عملاءك، أنشئ مشاريع جديدة، حمّل التصاميم، وتتبع الموافقات والتعليقات بسهولة عبر لوحة تحكم متكاملة مصممة خصيصاً لوكالات التصميم والتسويق.
                    </p>
                    <span
                      className="bg-secondary-foreground/20 px-6 py-2 rounded-full text-base font-bold text-secondary-foreground shadow hover:bg-secondary-foreground/30 transition-all duration-200 disabled:opacity-60 cursor-pointer select-none"
                      style={{ minWidth: '120px' }}
                    >
                      ابدأ الآن
                    </span>
                  </div>
                </button>
              </div>
            </div>
            {/* Loading message below the button */}
            {loading === 'seed' && (
              <div className="text-center mt-6 text-accent-foreground animate-fade-in">
                <span className="font-medium">جاري تجهيز البيانات التجريبية للوكالة المختارة...</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <Dialog open={showAll} onOpenChange={setShowAll}>
        <DialogContent className="max-w-md w-full min-h-[300px] max-h-[80vh] flex flex-col justify-start items-center">
          <DialogHeader>
            <DialogTitle>اختر نوع الوكالة</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 w-full mt-4 overflow-y-auto" style={{ maxHeight: '55vh' }}>
            {categories.map(cat => (
              <label key={cat.key} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${category === cat.key ? 'border-primary bg-primary/10 shadow-lg' : 'border-border bg-background hover:bg-accent/30'}`}
                onClick={() => { setCategory(cat.key as any); setShowAll(false); }}
                style={{ userSelect: 'none' }}
              >
                <div>{cat.icon}</div>
                <div className="flex-1">
                  <div className="font-bold text-lg mb-1">{cat.label}</div>
                  <div className="text-sm text-muted-foreground">{cat.desc}</div>
                </div>
                <input
                  type="radio"
                  name="agencyTypeDialog"
                  value={cat.key}
                  checked={category === cat.key}
                  onChange={() => { setCategory(cat.key as any); setShowAll(false); }}
                  className="form-radio accent-primary size-5"
                  style={{ pointerEvents: 'none' }}
                />
              </label>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}