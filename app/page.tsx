import FilterBar from "@/components/FilterBar";
import GalleryInfiniteScroll from "@/components/GalleryInfiniteScroll";
import db from "@/lib/prisma";
import Image from "next/image";
import { GalleryHorizontalIcon, UsersIcon, ShieldCheckIcon, ClockIcon, SmileIcon } from "lucide-react";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ClientAlertBar from "@/components/ClientAlertBar";
import { Suspense } from "react";

function HeroSection() {
  return (
    <section className="w-full max-w-5xl mx-auto flex flex-col items-center text-center py-12 gap-6">
      <div className="flex flex-col items-center gap-3">
        <div className="w-20 h-20 rounded-2xl bg-white shadow flex items-center justify-center border border-border mb-2">
          <Image src="/dta.svg" alt="شعار النظام" width={60} height={60} className="object-contain" />
        </div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
            منصة <span className="text-primary">معرض العملاء</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mt-2">
          استعرض، شارك، وراجع التصاميم بسهولة واحترافية. منصة مخصصة لعملاء الشركات الإبداعية.
        </p>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="w-full max-w-5xl mx-auto py-10 flex flex-col items-center gap-8">
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
        <div className="flex flex-col items-center gap-2">
          <UsersIcon className="size-8 text-primary" />
          <span className="text-2xl font-bold text-primary">+100</span>
          <span className="text-sm text-muted-foreground">عميل سعيد</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <GalleryHorizontalIcon className="size-8 text-primary" />
          <span className="text-2xl font-bold text-primary">+500</span>
          <span className="text-sm text-muted-foreground">تصميم تم تسليمه</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <ShieldCheckIcon className="size-8 text-primary" />
          <span className="text-2xl font-bold text-primary">7</span>
          <span className="text-sm text-muted-foreground">سنوات خبرة</span>
        </div>
      </div>
      <div className="text-center max-w-2xl mx-auto mt-6">
                  <p className="text-lg text-foreground font-medium">"خدمة رائعة وسريعة، سهّلت علينا مراجعة التصاميم والتواصل مع فريق التصميم بكل سهولة."</p>
          <span className="block mt-2 text-sm text-muted-foreground">— عميل حقيقي</span>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="w-full max-w-5xl mx-auto py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
      <div className="flex flex-col items-center gap-3">
        <GalleryHorizontalIcon className="size-8 text-primary" />
        <h3 className="font-bold text-lg">معرض تفاعلي</h3>
        <p className="text-sm text-muted-foreground">تصفح التصاميم بسهولة وبتجربة مستخدم سلسة على جميع الأجهزة.</p>
      </div>
      <div className="flex flex-col items-center gap-3">
        <ClockIcon className="size-8 text-primary" />
        <h3 className="font-bold text-lg">تسليم سريع</h3>
        <p className="text-sm text-muted-foreground">نضمن لك سرعة في تسليم التصاميم ومتابعة التعديلات.</p>
      </div>
      <div className="flex flex-col items-center gap-3">
        <SmileIcon className="size-8 text-primary" />
        <h3 className="font-bold text-lg">سهولة التواصل</h3>
        <p className="text-sm text-muted-foreground">تواصل مباشر مع فريق التصميم وترك التعليقات بسهولة.</p>
      </div>
      <div className="flex flex-col items-center gap-3">
        <ShieldCheckIcon className="size-8 text-primary" />
        <h3 className="font-bold text-lg">أمان وخصوصية</h3>
        <p className="text-sm text-muted-foreground">حماية كاملة لملفاتك وتصاميمك مع إمكانية مشاركة آمنة.</p>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
          <footer className="w-full py-6 text-center text-muted-foreground text-sm border-t mt-8">
      © {new Date().getFullYear()} نظام معرض العملاء. جميع الحقوق محفوظة.
    </footer>
  );
}

export default async function HomePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const limit = 20;
  const rawTypeId = params?.type;
  const rawClientId = params?.client;
  const typeId = Array.isArray(rawTypeId) ? rawTypeId[0] : rawTypeId || "";
  const clientId = Array.isArray(rawClientId) ? rawClientId[0] : rawClientId || "";

  const images = await db.image.findMany({
    where: {
      ...(typeId && { designTypeId: typeId }),
      ...(clientId && { clientId }),
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      uploader: { select: { id: true, name: true, role: true, identifier: true } },
      comments: true,
      designType: { select: { name: true } },
    },
  });
  const typeOptions = await db.designType.findMany({ select: { id: true, name: true } });
  const clientOptions = await db.user.findMany({ where: { role: "CLIENT" }, select: { id: true, name: true } });
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex flex-col items-center animate-fade-in relative">
      {/* <ClientAlertBar /> */}
      {/* Simulate Landing/Clear Data Button */}
      <Link
        href="/clear"
        className="fixed top-6 left-6 z-50 px-5 py-2 rounded-full bg-blue-200 text-blue-900 font-bold shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-blue-300 animate-bounce border border-blue-300"
        style={{ boxShadow: '0 4px 24px 0 rgba(0,112,244,0.10)' }}
      >
        🧪 نسخة تجريبية | التعليمات وطريقة الاستخدام
      </Link>
      <HeroSection />
      <section id="gallery" className="w-full max-w-6xl mx-auto py-10">
        {images.length > 0 && (
          <Suspense fallback={<div className="flex flex-wrap gap-4 mb-6">
            <div className="w-40 h-10 bg-muted animate-pulse rounded" />
            <div className="w-40 h-10 bg-muted animate-pulse rounded" />
          </div>}>
            <FilterBar typeOptions={typeOptions} clientOptions={clientOptions} />
          </Suspense>
        )}
        <GalleryInfiniteScroll
          initialImages={images}
          typeId={typeId}
          clientId={clientId}
        />
      </section>
      <TrustSection />
      <FeaturesSection />
      <FooterSection />
    </div>
  );
}
