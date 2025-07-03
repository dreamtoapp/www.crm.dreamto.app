'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
  ZapIcon
} from 'lucide-react';

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

export default function ClearLandingPage() {
  const [loading, setLoading] = useState<'none' | 'fresh' | 'seed'>('none');
  const router = useRouter();

  const handleReset = async (seedDemo: boolean) => {
    setLoading(seedDemo ? 'seed' : 'fresh');
    try {
      const res = await fetch(`/api/reset-demo${seedDemo ? '?seed=demo' : ''}`, { method: 'POST' });
      if (res.ok) {
        router.push('/');
      } else {
        alert('حدث خطأ أثناء إعادة التهيئة');
      }
    } catch {
      alert('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setLoading('none');
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
            <div className="relative z-10">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-accent/20 px-4 py-2 rounded-full border border-border/30 mb-6">
                  <ZapIcon className="size-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">العرض محدود الوقت</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary mb-6">
                  جاهز لتوفير 8 أيام؟
                </h2>
                <p className="text-xl text-foreground/90 mb-4 max-w-3xl mx-auto leading-relaxed">
                  ابدأ الآن وشاهد كيف ستوفر الوقت والمال وتزيد أرباحك بنسبة <span className="font-bold text-primary">25-40%</span> في أول 6 أشهر
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="size-4 text-success" />
                    <span>مجاني تماماً</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="size-4 text-success" />
                    <span>بدون بطاقة ائتمان</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="size-4 text-success" />
                    <span>ابدأ في دقائق</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <Link 
                  href="/" 
                  className="group relative overflow-hidden text-center p-8 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="bg-primary-foreground/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <CheckCircleIcon className="size-8" />
                    </div>
                    <h3 className="font-bold text-xl mb-3">استخدام البيانات الحالية</h3>
                    <p className="text-primary-foreground/90 text-sm mb-4">تابع مع البيانات الموجودة واستكشف الميزات</p>
                    <div className="bg-primary-foreground/20 px-3 py-1 rounded-full text-xs font-medium">
                      الأسرع للبدء
                    </div>
                  </div>
                </Link>
                
                <button
                  onClick={() => handleReset(false)}
                  disabled={loading === 'fresh' || loading === 'seed'}
                  className="group relative overflow-hidden text-center p-8 rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:scale-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/90 to-secondary/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-secondary to-muted rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="bg-secondary-foreground/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      {loading === 'fresh' ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-secondary-foreground border-t-transparent" />
                      ) : (
                        <RocketIcon className="size-8" />
                      )}
                    </div>
                    <h3 className="font-bold text-xl mb-3">بدء تجربة فارغة</h3>
                    <p className="text-secondary-foreground/90 text-sm mb-4">ابدأ من الصفر وأنشئ مشاريعك الخاصة</p>
                    <div className="bg-secondary-foreground/20 px-3 py-1 rounded-full text-xs font-medium">
                      {loading === 'fresh' ? 'جاري التحضير...' : 'للمبتدئين'}
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleReset(true)}
                  disabled={loading === 'fresh' || loading === 'seed'}
                  className="group relative overflow-hidden text-center p-8 rounded-2xl bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:scale-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/90 to-accent/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent to-primary rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="bg-accent-foreground/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      {loading === 'seed' ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent-foreground border-t-transparent" />
                      ) : (
                        <ZapIcon className="size-8" />
                      )}
                    </div>
                    <h3 className="font-bold text-xl mb-3">تهيئة بيانات تجريبية</h3>
                    <p className="text-accent-foreground/90 text-sm mb-4">استكشف المنصة مع بيانات وهمية كاملة</p>
                    <div className="bg-accent-foreground/20 px-3 py-1 rounded-full text-xs font-medium">
                      {loading === 'seed' ? 'جاري التحضير...' : 'الأكثر شمولية'}
                    </div>
                  </div>
                </button>
              </div>
              
              <div className="text-center mt-12">
                <div className="inline-flex items-center gap-4 bg-success/10 px-6 py-3 rounded-full border border-success/20">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    <span className="text-success text-sm font-medium">متاح الآن</span>
                  </div>
                  <div className="w-px h-4 bg-border"></div>
                  <span className="text-muted-foreground text-sm">
                    انضم لأكثر من 1000+ مصمم ووكالة
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}