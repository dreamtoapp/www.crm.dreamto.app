import db from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, MessageCircleIcon, InfoIcon, FileIcon, RulerIcon, UserIcon, ImageIcon, ArrowRightIcon } from 'lucide-react';

interface Props {
  params: { identifier: string; imageId: string };
}

export default async function ImageFullPage({ params }: Props) {
  const { imageId, identifier } = params;
  const image = await db.image.findUnique({
    where: { id: imageId },
    include: {
      uploader: { select: { id: true, name: true, role: true, identifier: true } },
      client: { select: { id: true, name: true, identifier: true } },
      comments: true,
      designType: true,
    },
  });
  if (!image) return notFound();

  return (
    <div className="min-h-screen bg-black/90 flex flex-col items-center justify-start p-0" dir="rtl">
      {/* Back Button */}
      <div className="w-full flex justify-end p-6">
        <Link href={`/designer/${identifier}`}>
          <Button variant="secondary" className="gap-2 rtl:flex-row-reverse">
            <ArrowRightIcon className="size-4" />
            العودة للمعرض
          </Button>
        </Link>
      </div>
      {/* Image */}
      <div className="w-full flex justify-center items-center mb-8">
        {image.url ? (
          <img
            src={image.url}
            alt={image.publicId}
            className="max-h-[70vh] w-auto object-contain mx-auto rounded-xl shadow-lg bg-white"
            style={{ background: 'white' }}
          />
        ) : (
          <ImageIcon className="size-24 text-gray-300 mx-auto my-12" />
        )}
      </div>
      {/* Info */}
      <div className="w-full max-w-2xl mx-auto bg-white/95 rounded-xl shadow-lg p-6 flex flex-col gap-4 mb-12">
        <div className="flex flex-wrap gap-2 items-center mb-2">
          <Badge variant="secondary">{image.client?.name || 'عميل غير معروف'}</Badge>
          <Badge>{image.designType?.name || 'نوع غير معروف'}</Badge>
        </div>
        <div className="flex flex-wrap gap-6 text-xs text-gray-600 mb-2">
          <div className="flex items-center gap-1">
            <UserIcon className="size-4" />
            {image.uploader?.name || image.uploader?.identifier || '—'}
          </div>
          <div className="flex items-center gap-1">
            <CalendarIcon className="size-4" />
            {image.createdAt ? new Date(image.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
          </div>
          <div className="flex items-center gap-1">
            <MessageCircleIcon className="size-4" />
            {image.comments?.length || 0} تعليق
          </div>
          <div className="flex items-center gap-1">
            <InfoIcon className="size-4" />
            {image.publicId}
          </div>
        </div>
        {/* Technical Info */}
        {(image.format || image.bytes || (image.width && image.height)) && (
          <div className="flex flex-row flex-wrap items-center gap-6 pt-2 text-xs text-gray-600">
            {image.format && (
              <div className="flex items-center gap-1">
                <FileIcon className="size-4" />
                <span>{image.format.toUpperCase()}</span>
              </div>
            )}
            {image.bytes && (
              <div className="flex items-center gap-1">
                <FileIcon className="size-4" />
                <span>{(image.bytes / 1024 < 1024 ? (image.bytes / 1024).toFixed(1) + ' KB' : (image.bytes / 1024 / 1024).toFixed(2) + ' MB')}</span>
              </div>
            )}
            {image.width && image.height && (
              <div className="flex items-center gap-1">
                <RulerIcon className="size-4" />
                <span>{image.width}×{image.height}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 