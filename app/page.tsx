"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { SparklesIcon, GalleryHorizontalIcon, UsersIcon, ShieldCheckIcon, ClockIcon, SmileIcon } from "lucide-react";
import { DesignType } from "../lib/types";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

// --- Constants ---
const clientNames = [
  "شركة ألف",
  "مؤسسة بيت التصميم",
  "عميل تجريبي",
  "مؤسسة الإبداع",
  "شركة المستقبل",
  "تصاميم العرب",
  "مؤسسة الرؤية",
  "شركة الفن الحديث",
  "عميل مميز",
  "مؤسسة التميز"
];

const designTypes = [
  DesignType.Logo,
  DesignType.Identity,
  DesignType.Website,
  DesignType.Print,
  DesignType.Ad,
  DesignType.App,
];

const unsplashIds = [
  "eOLpJytrbsQ", "LNRyGwIJr5c", "yC-Yzbqy7PY", "6VhPY27jdps", "Dwu85P9SOIk",
  "x8ZStukS2PM", "Jztmx9yqjBw", "pHANr-CpbYM", "iMchCC-2j8w", "9UVmlIb0wJU",
  "6-jTZysYY_U", "LrMWHKqilUw", "i7BSOoPa5hM", "0aMMMUjiiEQ", "vC8wj_Kphak",
  "6VhPY27jdps", "Dwu85P9SOIk", "eOLpJytrbsQ", "LNRyGwIJr5c", "yC-Yzbqy7PY",
  "x8ZStukS2PM", "Jztmx9yqjBw", "pHANr-CpbYM", "iMchCC-2j8w", "9UVmlIb0wJU",
  "6-jTZysYY_U", "LrMWHKqilUw", "i7BSOoPa5hM", "0aMMMUjiiEQ", "vC8wj_Kphak",
  "6VhPY27jdps", "Dwu85P9SOIk", "eOLpJytrbsQ", "LNRyGwIJr5c", "yC-Yzbqy7PY",
  "x8ZStukS2PM", "Jztmx9yqjBw", "pHANr-CpbYM", "iMchCC-2j8w", "9UVmlIb0wJU",
  "6-jTZysYY_U", "LrMWHKqilUw", "i7BSOoPa5hM", "0aMMMUjiiEQ", "vC8wj_Kphak",
  "6VhPY27jdps", "Dwu85P9SOIk", "eOLpJytrbsQ", "LNRyGwIJr5c", "yC-Yzbqy7PY",
  "x8ZStukS2PM", "Jztmx9yqjBw", "pHANr-CpbYM", "iMchCC-2j8w", "9UVmlIb0wJU",
  "6-jTZysYY_U", "LrMWHKqilUw", "i7BSOoPa5hM", "0aMMMUjiiEQ", "vC8wj_Kphak",
  "6VhPY27jdps", "Dwu85P9SOIk", "eOLpJytrbsQ", "LNRyGwIJr5c", "yC-Yzbqy7PY",
  "x8ZStukS2PM", "Jztmx9yqjBw", "pHANr-CpbYM", "iMchCC-2j8w", "9UVmlIb0wJU",
  "6-jTZysYY_U", "LrMWHKqilUw", "i7BSOoPa5hM", "0aMMMUjiiEQ", "vC8wj_Kphak",
  "6VhPY27jdps", "Dwu85P9SOIk", "eOLpJytrbsQ", "LNRyGwIJr5c", "yC-Yzbqy7PY"
];

// Generate 100 fake images with deterministic client names and design types
const fakeImages = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  url: `https://placehold.co/500x700.png?text=تصميم+${i + 1}`,
  width: 500,
  height: 700,
  client: clientNames[i % clientNames.length],
  type: designTypes[i % designTypes.length],
}));

// --- Custom Hook for Infinite Scroll ---
function useInfiniteScroll(callback: () => void, hasMore: boolean) {
  const [isFetching, setIsFetching] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching) {
          setIsFetching(true);
          callback();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current = observer;

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback, hasMore, isFetching]);

  useEffect(() => {
    if (isFetching) {
      const timer = setTimeout(() => {
        setIsFetching(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isFetching]);

  return { loadingRef, isFetching };
}

// --- Enhanced Helper Components ---
function ClientBadge({ client }: { client: string }) {
  return (
    <div className="flex items-center gap-2 min-w-0 group">
      <Avatar className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 text-white text-xs font-bold border-2 border-white shadow-md group-hover:scale-110 transition-transform duration-200">
        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white">
          {client.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <span className="text-xs font-semibold text-primary truncate max-w-[90px] group-hover:text-primary/80 transition-colors">
        {client || "عميل غير معروف"}
      </span>
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  const getBadgeColor = (type: string) => {
    const colors = {
      [DesignType.Logo]: "bg-gradient-to-r from-blue-500 to-blue-600",
      [DesignType.Identity]: "bg-gradient-to-r from-purple-500 to-purple-600",
      [DesignType.Website]: "bg-gradient-to-r from-green-500 to-green-600",
      [DesignType.Print]: "bg-gradient-to-r from-orange-500 to-orange-600",
      [DesignType.Ad]: "bg-gradient-to-r from-red-500 to-red-600",
      [DesignType.App]: "bg-gradient-to-r from-indigo-500 to-indigo-600",
    };
    return colors[type as DesignType] || "bg-gradient-to-r from-gray-500 to-gray-600";
  };

  return (
    <span className={`${getBadgeColor(type)} text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-white/20 truncate max-w-[80px] hover:scale-105 transition-transform duration-200`}>
      {type}
    </span>
  );
}

function DesignCard({ img, index }: { img: typeof fakeImages[0]; index: number }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <Card
      className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group relative rounded-2xl bg-card border-0 hover:-translate-y-2 animate-fade-in"
      style={{ 
        breakInside: "avoid",
        animationDelay: `${(index % 20) * 50}ms`
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <ClientBadge client={img.client} />
          <TypeBadge type={img.type} />
        </div>
      </CardHeader>
      
      <CardContent className="p-0 relative">
        <div className="relative overflow-hidden rounded-lg mx-4 mb-4">
          {!imageLoaded && !imageError && (
            <Skeleton className="w-full h-[300px] rounded-lg" />
          )}
          
          {!imageError && (
            <Image
              src={img.url}
              alt={`تصميم رقم ${img.id}`}
              width={img.width}
              height={img.height}
              className={`w-full h-[300px] object-cover group-hover:scale-110 transition-transform duration-700 rounded-lg ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Ss6LuYZY2+4tY5YuQPw=="
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          )}
          
          {imageError && (
            <div className="w-full h-[300px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">🖼️</div>
                <div className="text-sm">فشل تحميل الصورة</div>
              </div>
            </div>
          )}
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-lg" />
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 pb-4">
        <div className="w-full flex justify-between items-center">
          <span className="bg-gradient-to-r from-gray-800 to-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
            تصميم رقم {img.id}
          </span>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="text-primary hover:text-primary/80 text-sm font-medium">
              عرض التفاصيل
            </button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

// --- Loading Skeleton Component ---
function LoadingSkeleton() {
  return (
    <div className="grid gap-6 sm:gap-8" style={{
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    }}>
      {Array.from({ length: 6 }, (_, i) => (
        <Card key={i} className="overflow-hidden rounded-2xl border-0">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-20 h-4" />
              </div>
              <Skeleton className="w-16 h-6 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="mx-4 mb-4">
              <Skeleton className="w-full h-[300px] rounded-lg" />
            </div>
          </CardContent>
          <CardFooter className="pt-0 pb-4">
            <Skeleton className="w-24 h-6 rounded-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

// --- Main HomePage Component ---
export default function HomePage() {
  const [images, setImages] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const limit = 20;

  // Fetch images paginated
  const fetchImages = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/images?page=${page}&limit=${limit}`);
      const data = await res.json();
      if (Array.isArray(data.images)) {
        setImages(prev => [...prev, ...data.images]);
        setHasMore(data.hasMore);
        setPage(prev => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [page, hasMore, loading]);

  // Initial load
  useEffect(() => {
    setImages([]);
    setPage(1);
    setHasMore(true);
    setInitialLoading(true);
  }, []);

  // Load first page on mount
  useEffect(() => {
    if (page === 1 && images.length === 0 && hasMore) {
      fetchImages();
    }
    // eslint-disable-next-line
  }, [page, images.length, hasMore]);

  // Infinite scroll hook
  const { loadingRef } = useInfiniteScroll(() => {
    if (!loading && hasMore) fetchImages();
  }, hasMore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex flex-col items-center animate-fade-in">
      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto flex flex-col items-center text-center py-12 gap-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-2xl bg-white shadow flex items-center justify-center border border-gray-200 mb-2">
            <Image src="/dta.svg" alt="شعار النظام" width={60} height={60} className="object-contain" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            منصة <span className="text-primary-800">معرض العملاء</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mt-2">
            استعرض، شارك، وراجع التصاميم بسهولة واحترافية. منصة مخصصة لعملاء الشركات الإبداعية.
          </p>
        </div>
      </section>
      {/* Gallery Preview */}
      <section id="gallery" className="w-full max-w-6xl mx-auto py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {images.map((img, i) => (
            <Card key={img.id || i} className="overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer">
              <div className="relative w-full h-40 bg-muted flex items-center justify-center">
                <Image src={img.url} alt={img.type || 'Design'} fill className="object-contain group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-4 flex flex-col gap-2">
                <Badge variant="secondary" className="w-fit">{img.type || 'Design'}</Badge>
                <span className="font-bold text-primary-800 truncate">{img.client || 'Client'}</span>
              </div>
            </Card>
          ))}
          {initialLoading && Array.from({ length: 8 }).map((_, i) => (
            <Card key={"skeleton-" + i} className="h-56 animate-pulse bg-slate-100 rounded-2xl" />
          ))}
        </div>
        {/* Infinite scroll loading indicator */}
        <div ref={loadingRef} className="flex justify-center items-center py-6 min-h-[40px]">
          {loading && !initialLoading && <span className="text-gray-400">Loading more...</span>}
          {!hasMore && !initialLoading && images.length > 0 && (
            <span className="text-gray-400">No more images to show.</span>
          )}
        </div>
      </section>
      {/* Trust Section */}
      <section className="w-full max-w-5xl mx-auto py-10 flex flex-col items-center gap-8">
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          <div className="flex flex-col items-center gap-2">
            <UsersIcon className="size-8 text-primary-700" />
            <span className="text-2xl font-bold text-primary-800">+100</span>
            <span className="text-sm text-gray-500">عميل سعيد</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <GalleryHorizontalIcon className="size-8 text-primary-700" />
            <span className="text-2xl font-bold text-primary-800">+500</span>
            <span className="text-sm text-gray-500">تصميم تم تسليمه</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ShieldCheckIcon className="size-8 text-primary-700" />
            <span className="text-2xl font-bold text-primary-800">7</span>
            <span className="text-sm text-gray-500">سنوات خبرة</span>
          </div>
        </div>
        <div className="text-center max-w-2xl mx-auto mt-6">
          <p className="text-lg text-gray-700 font-medium">"خدمة رائعة وسريعة، سهّلت علينا مراجعة التصاميم والتواصل مع فريق التصميم بكل سهولة."</p>
          <span className="block mt-2 text-sm text-gray-500">— عميل حقيقي</span>
        </div>
      </section>
      {/* Features Section */}
      <section className="w-full max-w-5xl mx-auto py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <GalleryHorizontalIcon className="size-8 text-primary-700" />
          <h3 className="font-bold text-lg">معرض تفاعلي</h3>
          <p className="text-sm text-gray-500">تصفح التصاميم بسهولة وبتجربة مستخدم سلسة على جميع الأجهزة.</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <ClockIcon className="size-8 text-primary-700" />
          <h3 className="font-bold text-lg">تسليم سريع</h3>
          <p className="text-sm text-gray-500">نضمن لك سرعة في تسليم التصاميم ومتابعة التعديلات.</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <SmileIcon className="size-8 text-primary-700" />
          <h3 className="font-bold text-lg">سهولة التواصل</h3>
          <p className="text-sm text-gray-500">تواصل مباشر مع فريق التصميم وترك التعليقات بسهولة.</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <ShieldCheckIcon className="size-8 text-primary-700" />
          <h3 className="font-bold text-lg">أمان وخصوصية</h3>
          <p className="text-sm text-gray-500">حماية كاملة لملفاتك وتصاميمك مع إمكانية مشاركة آمنة.</p>
        </div>
      </section>
      {/* Footer */}
      <footer className="w-full py-6 text-center text-gray-400 text-sm border-t mt-8">
        © {new Date().getFullYear()} نظام معرض العملاء. جميع الحقوق محفوظة.
      </footer>
    </div>
  );
}

// --- Scroll to Top Component ---
function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      className={`fixed bottom-6 left-6 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
      onClick={scrollToTop}
      aria-label="العودة إلى الأعلى"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
}
