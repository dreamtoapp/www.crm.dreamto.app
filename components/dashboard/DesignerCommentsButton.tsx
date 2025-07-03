"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircleIcon } from 'lucide-react';
import Link from 'next/link';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';

export default function DesignerCommentsButton({ designerId }: { designerId: string }) {
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<any[]>([]);

  const handleOpen = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/designer/pending-comments?designerId=${designerId}`);
      if (!res.ok) throw new Error('فشل في جلب البيانات');
      const data = await res.json();
      setComments(data);
    } catch (e) {
      setComments([]);
    }
    setLoading(false);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" size="lg" className="gap-2 rtl:flex-row-reverse" onClick={handleOpen}>
          <MessageCircleIcon className="size-5" />
          عرض التعليقات
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle>التعليقات بانتظار الرد</SheetTitle>
          <SheetDescription>
            هنا تجد جميع التعليقات من العملاء التي تحتاج إلى رد منك.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto mt-4 space-y-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">جاري التحميل...</div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">لا توجد تعليقات بانتظار الرد.</div>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex items-center gap-4 bg-muted rounded-lg p-3 shadow-sm">
                <img src={c.image} alt="صورة التصميم" className="w-16 h-16 rounded object-cover border" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-primary truncate">{c.client}</div>
                  <div className="text-sm text-gray-700 truncate">{c.text}</div>
                  <div className="text-xs text-gray-500 mt-1">{c.date}</div>
                </div>
                <Link href={`/designer/image/${c.imageId}`}>
                  <Button size="sm" variant="outline">انتقل</Button>
                </Link>
              </div>
            ))
          )}
        </div>
        <SheetFooter className="mt-4">
          <SheetClose asChild>
            <Button variant="outline" className="w-full">إغلاق</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
} 