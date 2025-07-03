import db from '@/lib/prisma';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ imageId: string }> }): Promise<Metadata> {
  const { imageId } = await params;
  const image = await db.image.findUnique({ where: { id: imageId } });
  if (!image) return { title: 'الصورة غير موجودة' };
  return {
    title: image.publicId || 'عرض صورة',
    openGraph: {
      images: [image.url],
      title: image.publicId || 'عرض صورة',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      images: [image.url],
    },
  };
}

export default async function ViewImagePage({ params }: { params: Promise<{ imageId: string }> }) {
  const { imageId } = await params;
  const image = await db.image.findUnique({ where: { id: imageId } });
  if (!image) return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center text-gray-500 text-lg">الصورة غير موجودة</div>
    </main>
  );
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-full max-h-[80vh] w-auto h-auto shadow-xl rounded-2xl overflow-hidden border border-border/40 bg-white">
        <Image
          src={image.url}
          alt={image.publicId || 'صورة تصميم'}
          width={image.width || 800}
          height={image.height || 600}
          className="object-contain w-full h-full"
          priority
        />
      </div>
      {image.publicId && (
        <div className="mt-4 text-gray-700 text-sm text-center truncate max-w-md">{image.publicId}</div>
      )}
    </main>
  );
} 