'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ClearLandingPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reset-demo', { method: 'POST' });
      if (res.ok) {
        router.push('/');
      } else {
        alert('حدث خطأ أثناء إعادة التهيئة');
      }
    } catch {
      alert('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-pink-50 to-purple-100 p-6 animate-fade-in" dir="rtl">
      <div className="max-w-xl w-full bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6 border border-blue-100">
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-500 mb-2">جربة من جديد</h1>
        <p className="text-lg text-blue-900/80 text-center leading-relaxed mb-4">
          هذه المنصة تتيح لك تجربة نظام إدارة مشاريع التصميم بين العملاء والمصممين. يمكنك استعراض التصاميم، إضافة التعليقات، طلب التعديلات، والتواصل مع فريق التصميم بشكل تفاعلي وسهل.
        </p>
        <ul className="text-base text-blue-700/80 mb-6 list-disc pr-6 text-right">
          <li>تصفح معرض التصاميم وفلترتها حسب النوع أو العميل</li>
          <li>أضف تعليقاتك أو ردودك على كل صورة</li>
          <li>جرب دور العميل أو المصمم أو المشرف</li>
          <li>كل شيء يدعم العربية (RTL) بالكامل</li>
        </ul>
        <div className="flex flex-col md:flex-row gap-4 w-full mt-4">
          <Link href="/" className="flex-1 text-center px-6 py-3 rounded-lg bg-blue-200 text-blue-900 font-bold text-lg shadow transition-transform duration-200 hover:scale-105 hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200">
            تجربة البيانات الحالية
          </Link>
          <button
            onClick={handleReset}
            disabled={loading}
            className="flex-1 text-center px-6 py-3 rounded-lg bg-pink-200 text-pink-900 font-bold text-lg shadow transition-transform duration-200 hover:scale-105 hover:bg-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-200 disabled:opacity-60"
          >
            {loading ? '...جاري إعادة التهيئة' : 'بدء ببيانات جديدة'}
          </button>
        </div>
      </div>
    </div>
  );
} 