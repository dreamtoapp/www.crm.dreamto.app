"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { SparklesIcon } from "lucide-react";
import { DesignType } from "../lib/types";

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
  const [images, setImages] = useState(fakeImages.slice(0, 20));
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreImages = useCallback(() => {
    const next = images.length + 20;
    if (next >= fakeImages.length) {
      setImages(fakeImages);
      setHasMore(false);
    } else {
      setImages(fakeImages.slice(0, next));
    }
  }, [images.length]);

  const { loadingRef, isFetching } = useInfiniteScroll(fetchMoreImages, hasMore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Restored Enhanced Header */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="text-center flex flex-col items-center gap-2 md:flex-row md:justify-center md:items-center md:gap-6">
            <div className="flex justify-center items-center mb-2 md:mb-0">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary-800 flex items-center justify-center shadow-lg">
                <SparklesIcon className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-2 md:mb-0">
                معرض التصاميم
              </h1>
              <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
                استكشف مجموعة متنوعة من التصاميم الإبداعية من أفضل المصممين
              </p>
              <div className="flex justify-center items-center gap-4 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  {images.length} تصميم
                </span>
                <span>•</span>
                <span>{hasMore ? 'المزيد متاح' : 'تم عرض الكل'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Images Grid */}
        <div
          className="grid gap-6 sm:gap-8 mb-8"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            direction: "rtl",
          }}
        >
          {images.map((img, index) => (
            <DesignCard key={img.id} img={img} index={index} />
          ))}
        </div>
        {/* Loading States */}
        {isFetching && <LoadingSkeleton />}
        {/* Intersection Observer Target */}
        {hasMore && (
          <div ref={loadingRef} className="h-20 flex items-center justify-center">
            {!isFetching && (
              <div className="text-center text-muted-foreground">
                <div className="animate-pulse">جاري التحميل...</div>
              </div>
            )}
          </div>
        )}
        {/* End Message */}
        {!hasMore && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">تم عرض جميع التصاميم!</h3>
              <p className="text-muted-foreground">
                لقد استكشفت جميع التصاميم المتاحة في المعرض
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Scroll to Top Button */}
      <ScrollToTopButton />
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
