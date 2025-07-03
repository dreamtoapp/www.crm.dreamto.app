"use client";
import React from 'react';
import Link from 'next/link';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ImageIcon, InfoIcon, Clock, MessageCircle, Share2, CheckCircle, XCircle, RefreshCw, Eye, EyeOff, UserIcon } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'اليوم';
  if (diffDays === 1) return 'منذ يوم';
  if (diffDays < 10) return `منذ ${diffDays} أيام`;
  return date.toLocaleDateString('ar-EG');
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'APPROVED':
      return (
        <Badge className="bg-green-100 text-green-800 border-0 text-xs flex items-center gap-1">
          <CheckCircle className="size-4 text-green-500" /> تمت الموافقة
        </Badge>
      );
    case 'REJECTED':
      return (
        <Badge className="bg-red-100 text-red-800 border-0 text-xs flex items-center gap-1">
          <XCircle className="size-4 text-red-500" /> مرفوض
        </Badge>
      );
    case 'REVISION_REQUESTED':
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-0 text-xs flex items-center gap-1">
          <RefreshCw className="size-4 text-yellow-600" /> بحاجة لتعديل
        </Badge>
      );
    case 'PENDING':
    default:
      return (
        <Badge className="bg-gray-200 text-gray-700 border-0 text-xs flex items-center gap-1">
          <Clock className="size-4 text-gray-500" /> قيد الانتظار
        </Badge>
      );
  }
}

function getViewIconByStatus(status: string) {
  switch (status) {
    case 'APPROVED':
      return { icon: <Eye className="size-5 text-green-600" />, tooltip: 'تمت الموافقة' };
    case 'PENDING':
      return { icon: <Clock className="size-5 text-gray-400" />, tooltip: 'قيد الانتظار' };
    case 'REJECTED':
      return { icon: <EyeOff className="size-5 text-red-600" />, tooltip: 'مرفوض' };
    case 'REVISION_REQUESTED':
      return { icon: <RefreshCw className="size-5 text-yellow-500" />, tooltip: 'بحاجة لتعديل' };
    default:
      return { icon: <Eye className="size-5 text-gray-400" />, tooltip: 'غير معروف' };
  }
}

export function ClientImageGrid({ images, designTypes, clientId }: {
  images: any[];
  designTypes: any[];
  clientId: string;
}) {
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {images.map(img => {
        const tagValue = typeof (img as any).tag === 'string' && (img as any).tag.length > 0 ? (img as any).tag : '—';
        const uploaderName = (img as any).uploader?.name || '';
        const commentsCount = Array.isArray((img as any).comments) ? (img as any).comments.length : undefined;
        const uploadDate = img.createdAt ? formatDate(typeof img.createdAt === 'string' ? img.createdAt : img.createdAt.toISOString()) : '';
        const altText = tagValue !== '—' ? tagValue : (designTypes.find(dt => dt.id === img.designTypeId)?.name || 'صورة تصميم');
        return (
          <div key={img.id} className="relative group">
            <Card className="card-interactive gpu-accelerated group transition-transform duration-200 hover:scale-[1.025] hover:shadow-xl rounded-2xl border border-border/60 overflow-hidden">
              <div className="image-container aspect-[4/3] relative">
                {img.url ? (
                  <Image
                    src={img.url}
                    alt={altText}
                    fill
                    className="object-cover w-full h-full rounded-t-2xl"
                    style={{ maxHeight: 240 }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={false}
                  />
                ) : (
                  <ImageIcon className="size-12 text-gray-300 mx-auto my-12" />
                )}
                {/* Status Badge Overlay */}
                <div className="absolute top-2 left-2">
                  {img.status && getStatusBadge(img.status)}
                </div>
                {/* Info Icon Button */}
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-white/80 rounded-full p-1 shadow hover:bg-white"
                  aria-label="معلومات تقنية عن الصورة"
                  onClick={() => setOpenId(img.id)}
                >
                  <InfoIcon className="size-5 text-gray-700" />
                </button>
              </div>
              {/* Enhanced Card Footer: 2-row layout for clarity and UX */}
              <div className="px-3 py-2 bg-background border-t border-border/40 flex flex-col gap-1">
                {/* Top row: Designer name and upload date */}
                <div className="flex items-center justify-between w-full">
                  <span className="flex items-center gap-1 font-semibold text-primary truncate max-w-[110px]">
                    <UserIcon className="size-4 text-primary/80" />
                    {uploaderName || '—'}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-4" /> {uploadDate}
                  </span>
                </div>
                {/* Bottom row: Status and Share */}
                <div className="flex items-center justify-between w-full mt-1">
                  {/* Status icon + label as link */}
                  {(() => {
                    const { icon, tooltip } = getViewIconByStatus(img.status);
                    return (
                      <Link
                        href={`/client/${clientId}/image/${img.id}`}
                        aria-label={`عرض تفاصيل التصميم (${tooltip})`}
                        className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                      >
                        {icon}
                        {tooltip}
                      </Link>
                    );
                  })()}
                  {/* Share Icon (unchanged) */}
                  <div className="flex items-center gap-1">
                    <button
                      aria-label="نسخ رابط المشاركة"
                      className="hover:text-primary transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.origin + `/view/${img.id}`);
                        setCopiedId(img.id);
                        setTimeout(() => setCopiedId(null), 1200);
                      }}
                    >
                      <Share2 className="size-5" />
                    </button>
                    {copiedId === img.id && (
                      <span className="text-xs text-green-600 ml-1">تم النسخ!</span>
                    )}
                  </div>
                </div>
              </div>
              {/* End Card Footer */}
              <CardHeader className="hidden" />
              {/* Hide old header content */}
            </Card>
            {/* Technical Info Dialog */}
            <Dialog open={openId === img.id} onOpenChange={open => setOpenId(open ? img.id : null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>معلومات تقنية عن الصورة</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 text-sm">
                  <div><b>Public ID:</b> {img.publicId}</div>
                  <div><b>URL:</b> <a href={img.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{img.url}</a></div>
                  <div><b>Format:</b> {img.format || '—'}</div>
                  <div><b>الحجم (bytes):</b> {img.bytes || '—'}</div>
                  <div><b>الأبعاد:</b> {img.width || '—'} × {img.height || '—'}</div>
                  <div><b>تاريخ الرفع:</b> {uploadDate}</div>
                  <div><b>الحالة:</b> {img.status}</div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );
      })}
    </div>
  );
} 