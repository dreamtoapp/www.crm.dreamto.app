"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GalleryHorizontalIcon, UploadCloudIcon } from "lucide-react";
import { DesignType } from "@/lib/types";

// Helper: Infinite scroll hook
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
      const timer = setTimeout(() => setIsFetching(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isFetching]);

  return { loadingRef, isFetching };
}

export default function DesignerDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params?.clientId as string;
  const [clientName, setClientName] = useState<string | null>(null);
  const [images, setImages] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;

  // Fetch clientName by clientId
  useEffect(() => {
    if (!clientId) return;
    fetch(`/api/users/${clientId}`)
      .then(res => res.json())
      .then(data => setClientName(data.name))
      .catch(() => setClientName(null));
  }, [clientId]);

  // Fetch images for this clientName
  const fetchImages = useCallback(() => {
    if (!clientName) return;
    fetch(`/api/images?clientName=${encodeURIComponent(clientName)}`)
      .then(res => res.json())
      .then(data => {
        const next = data.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
        setImages(prev => [...prev, ...next]);
        setHasMore(data.length > (page + 1) * PAGE_SIZE);
        setPage(p => p + 1);
      });
  }, [clientName, page]);

  useEffect(() => {
    if (clientName && images.length === 0) {
      fetchImages();
    }
    // eslint-disable-next-line
  }, [clientName]);

  const { loadingRef, isFetching } = useInfiniteScroll(fetchImages, hasMore);

  // Analytics
  const total = images.length;
  const byType: Record<string, number> = {};
  images.forEach(img => {
    byType[img.designType] = (byType[img.designType] || 0) + 1;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Top Bar with Upload Button */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">لوحة المصمم</h1>
          <div className="text-muted-foreground text-sm">معرفك: <span className="font-mono text-primary-700">{clientId}</span></div>
        </div>
        <Button
          className="btn-primary flex items-center gap-2"
          onClick={() => router.push("/designer/upload")}
        >
          <UploadCloudIcon className="size-5" /> رفع تصاميم جديدة
        </Button>
      </div>
      {/* Analytics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 text-center">
          <div className="text-lg font-bold">{total}</div>
          <div className="text-xs text-muted-foreground">إجمالي التصاميم</div>
        </Card>
        {Object.entries(byType).map(([type, count]) => (
          <Card key={type} className="p-4 text-center">
            <div className="text-lg font-bold">{count}</div>
            <div className="text-xs text-muted-foreground">{type}</div>
          </Card>
        ))}
      </div>
      {/* Images Grid */}
      <div
        className="grid gap-6 sm:gap-8 mb-8"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", direction: "rtl" }}
      >
        {images.map((img, idx) => (
          <Card key={img.id} className="overflow-hidden rounded-2xl border-0">
            <img src={img.url} alt={img.designType} className="w-full h-60 object-cover" />
            <div className="p-4 flex flex-col gap-2">
              <div className="font-bold text-primary">{img.designType}</div>
              <div className="text-xs text-muted-foreground">{img.clientName}</div>
              <div className="text-xs">{new Date(img.createdAt).toLocaleDateString()}</div>
            </div>
          </Card>
        ))}
      </div>
      {/* Infinite Scroll Loading */}
      {isFetching && <div className="text-center py-4">جاري التحميل...</div>}
      {hasMore && <div ref={loadingRef} className="h-12" />}
      {!hasMore && images.length > 0 && (
        <div className="text-center text-muted-foreground py-8">تم عرض جميع التصاميم</div>
      )}
    </div>
  );
} 