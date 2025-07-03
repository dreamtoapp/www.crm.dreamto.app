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
      className="group relative overflow-hidden bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-lg hover:border-border transition-all duration-300 hover:-translate-y-1 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="text-primary group-hover:text-primary/80 transition-colors duration-300 group-hover:scale-110 transform">
          {icon}
        </div>
        <div className="font-bold text-foreground text-lg group-hover:text-foreground/80 transition-colors duration-300">
          {title}
        </div>
        <div className="text-muted-foreground text-sm text-center leading-relaxed">
          {desc}
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
      className="bg-card/90 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-border/50 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-2 mb-3">
        {[...Array(5)].map((_, i) => (
          <StarIcon key={i} className="size-4 text-chart-4 fill-current" />
        ))}
      </div>
      <blockquote className="text-foreground/80 text-sm leading-relaxed mb-4 italic">
        "{quote}"
      </blockquote>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-primary-foreground font-bold">
          {author.charAt(0)}
        </div>
        <div>
          <div className="font-semibold text-foreground text-sm">{author}</div>
          <div className="text-muted-foreground text-xs">{role}</div>
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
      className="text-center animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-primary mb-2 flex justify-center">
        {icon}
      </div>
      <div className="text-2xl font-bold text-foreground mb-1">{number}</div>
      <div className="text-muted-foreground text-sm">{label}</div>
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20 p-4 sm:p-6 animate-fade-in" dir="rtl">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img src="/dta.svg" alt="Logo" className="w-20 h-20 drop-shadow-lg" />
              <div className="absolute -inset-2 bg-gradient-to-r from-primary to-accent rounded-full opacity-20 blur-lg animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-6 leading-tight">
            منصة معرض العملاء
          </h1>
          
          <p className="text-xl sm:text-2xl text-foreground/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            منصة احترافية لإدارة مشاريع التصميم والتواصل بين العملاء والمصممين
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <StatsCard 
              icon={<TrendingUpIcon className="size-6" />}
              number="300%"
              label="تحسن في سرعة التواصل"
              delay={200}
            />
            <StatsCard 
              icon={<ClockIcon className="size-6" />}
              number="50%"
              label="توفير في الوقت"
              delay={400}
            />
            <StatsCard 
              icon={<ZapIcon className="size-6" />}
              number="99%"
              label="رضا العملاء"
              delay={600}
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12 animate-fade-in">
            لماذا تختار منصتنا؟
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<GalleryHorizontalIcon className="size-8" />} 
              title="معرض مركزي" 
              desc="كل التصاميم والمشاريع في مكان واحد مع تنظيم احترافي وسهولة في الوصول."
              delay={0}
            />
            <FeatureCard 
              icon={<MessageCircleIcon className="size-8" />} 
              title="دردشة وتعليقات" 
              desc="تواصل مباشر وتعليقات متداخلة لكل مشروع مع إشعارات فورية."
              delay={100}
            />
            <FeatureCard 
              icon={<BellIcon className="size-8" />} 
              title="إشعارات ذكية" 
              desc="لا تفوت أي تحديث أو طلب تعديل مع نظام إشعارات متقدم."
              delay={200}
            />
            <FeatureCard 
              icon={<ShieldCheckIcon className="size-8" />} 
              title="أمان وخصوصية" 
              desc="حماية كاملة للملفات والتصاميم مع تشفير متقدم."
              delay={300}
            />
          </div>
        </div>

        {/* Target Audience Section */}
        <div className="mb-16 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-border/50">
            <h2 className="text-3xl font-bold text-center text-foreground mb-8">
              مصممة خصيصاً لـ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center group">
                <div className="bg-gradient-to-br from-primary to-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <UsersIcon className="size-8 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-foreground mb-2">وكالات التصميم</h3>
                <p className="text-muted-foreground text-sm">إدارة متقدمة للمشاريع والعملاء</p>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-chart-1 to-chart-2 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <RocketIcon className="size-8 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-foreground mb-2">الشركات الناشئة</h3>
                <p className="text-muted-foreground text-sm">حلول مرنة وقابلة للتوسع</p>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-chart-3 to-chart-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheckIcon className="size-8 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-foreground mb-2">فرق التسويق</h3>
                <p className="text-muted-foreground text-sm">تنسيق سلس مع المصممين</p>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-chart-5 to-success rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircleIcon className="size-8 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-foreground mb-2">المصممين المستقلين</h3>
                <p className="text-muted-foreground text-sm">أدوات احترافية لإدارة العملاء</p>
              </div>
            </div>
          </div>
        </div>

        {/* How it works Section */}
        <div className="mb-16 animate-fade-in" style={{ animationDelay: '600ms' }}>
          <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-border/50">
            <h2 className="text-3xl font-bold text-center text-foreground mb-8">
              كيف تعمل المنصة؟
            </h2>
            <div className="space-y-6">
              {[
                { step: 1, title: "ارفع التصميم", desc: "ارفع التصميم أو المشروع بسهولة مع معاينة فورية" },
                { step: 2, title: "شارك الرابط", desc: "شارك الرابط مع العميل أو الفريق بنقرة واحدة" },
                { step: 3, title: "استقبل التعليقات", desc: "استقبل التعليقات وطلبات التعديل مباشرة على التصميم" },
                { step: 4, title: "رد واتفاعل", desc: "رد على كل تعليق أو طلب بسهولة مع نظام المحادثة المتقدم" },
                { step: 5, title: "تابع التقدم", desc: "تابع حالة كل مشروع حتى الموافقة النهائية مع تقارير شاملة" }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4 group">
                  <div className="bg-gradient-to-br from-primary to-accent rounded-full w-10 h-10 flex items-center justify-center text-primary-foreground font-bold group-hover:scale-110 transition-transform duration-300">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                  <ArrowRightIcon className="size-5 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-16 animate-fade-in" style={{ animationDelay: '800ms' }}>
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            ماذا يقول عملاؤنا؟
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestimonialCard 
              quote="المنصة غيرت طريقة عملنا بالكامل. التواصل مع العملاء أصبح أسهل وأكثر تنظيماً."
              author="أحمد محمد"
              role="مدير وكالة تصميم"
              delay={0}
            />
            <TestimonialCard 
              quote="وفرت علينا ساعات من العمل اليومي. الآن كل شيء في مكان واحد ومنظم."
              author="فاطمة أحمد"
              role="مصممة جرافيك"
              delay={100}
            />
            <TestimonialCard 
              quote="أفضل استثمار قمنا به لتطوير عملنا. العملاء راضون جداً عن التجربة."
              author="محمد علي"
              role="مؤسس شركة ناشئة"
              delay={200}
            />
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="animate-fade-in" style={{ animationDelay: '1000ms' }}>
          <div className="bg-card/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-border/50">
            <h2 className="text-3xl font-bold text-center text-foreground mb-6">
              ابدأ تجربتك المجانية الآن
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              جرب المنصة مجاناً واكتشف كيف يمكنها تحسين سير عملك وزيادة رضا عملائك
            </p>
            
            <div className="flex flex-col lg:flex-row gap-4 max-w-4xl mx-auto">
              <Link 
                href="/" 
                className="group relative overflow-hidden flex-1 text-center px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 flex items-center justify-center gap-2">
                  <CheckCircleIcon className="size-5" />
                  استخدام البيانات الحالية
                </div>
              </Link>
              
              <button
                onClick={() => handleReset(false)}
                disabled={loading === 'fresh' || loading === 'seed'}
                className="group relative overflow-hidden flex-1 text-center px-8 py-4 rounded-xl bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 to-secondary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {loading === 'fresh' ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-secondary-foreground border-t-transparent" />
                      جاري بدء تجربة فارغة...
                    </>
                  ) : (
                    <>
                      <RocketIcon className="size-5" />
                      بدء تجربة فارغة
                    </>
                  )}
                </div>
              </button>
              
              <button
                onClick={() => handleReset(true)}
                disabled={loading === 'fresh' || loading === 'seed'}
                className="group relative overflow-hidden flex-1 text-center px-8 py-4 rounded-xl bg-gradient-to-r from-accent to-accent/90 text-accent-foreground font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent/90 to-accent/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {loading === 'seed' ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-accent-foreground border-t-transparent" />
                      جاري تهيئة بيانات تجريبية...
                    </>
                  ) : (
                    <>
                      <ZapIcon className="size-5" />
                      تهيئة بيانات تجريبية
                    </>
                  )}
                </div>
              </button>
            </div>
            
            <div className="text-center mt-6">
              <p className="text-muted-foreground text-sm">
                ✨ مجاني تماماً • بدون بطاقة ائتمان • ابدأ في دقائق
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}