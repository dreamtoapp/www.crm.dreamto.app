"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ClientAlertBar() {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (searchParams.get('fresh') === '1') setShow(true);
  }, [searchParams]);
  if (!show) return null;
  return (
    <div className="w-full h-10 flex items-center justify-center bg-gradient-to-r from-blue-400/90 to-cyan-500/90 text-white font-bold text-sm shadow-lg animate-fade-in" dir="rtl">
      <span>
        تم إنشاء حساب مدير النظام. استخدم المعرف: <span className="underline">A001</span> لتسجيل الدخول واستكشاف المنصة.
      </span>
      <button
        onClick={() => setShow(false)}
        className="mr-4 text-white text-lg font-bold hover:text-gray-200 focus:outline-none"
        aria-label="إغلاق التنبيه"
      >
        ×
      </button>
    </div>
  );
} 