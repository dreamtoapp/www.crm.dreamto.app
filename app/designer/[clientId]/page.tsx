"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GalleryHorizontalIcon, UploadCloudIcon } from "lucide-react";

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

interface Client {
  id: string;
  name: string;
}

interface DesignTypeOption {
  id: string;
  name: string;
}

export default function DesignerDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const clientIdentifier = params?.clientId as string;
  const [designerId, setDesignerId] = useState<string>("");
  const [images, setImages] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;
  const [clients, setClients] = useState<Client[]>([]);
  const [designTypes, setDesignTypes] = useState<DesignTypeOption[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");

  // Fetch all clients and design types for filters
  useEffect(() => {
    fetch('/api/users?role=CLIENT')
      .then(res => res.json())
      .then(data => setClients(data));
    fetch('/api/design-types')
      .then(res => res.json())
      .then(data => setDesignTypes(data));
  }, []);

  // Fetch designer's ObjectId by identifier
  useEffect(() => {
    if (!clientIdentifier) return;
    fetch(`/api/users/${clientIdentifier}`)
      .then(res => res.json())
      .then(data => setDesignerId(data.id));
  }, [clientIdentifier]);

  // Fetch images for this designer, with optional filters
  const fetchImages = useCallback(() => {
    if (!designerId) return;
    let url = `/api/images?uploaderId=${encodeURIComponent(designerId)}`;
    if (selectedClient) url += `&clientName=${encodeURIComponent(selectedClient)}`;
    if (selectedType) url += `&designTypeId=${encodeURIComponent(selectedType)}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          setHasMore(false);
          return;
        }
        const next = data.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
        setImages(prev => {
          const all = [...prev, ...next];
          // Deduplicate by id
          return Array.from(new Map(all.map(img => [img.id, img])).values());
        });
        setHasMore(data.length > (page + 1) * PAGE_SIZE);
        setPage(p => p + 1);
      });
  }, [designerId, selectedClient, selectedType, page]);

  useEffect(() => {
    setImages([]);
    setPage(0);
    setHasMore(true);
  }, [selectedClient, selectedType, designerId]);

  useEffect(() => {
    if (images.length === 0 && hasMore) {
      fetchImages();
    }
    // eslint-disable-next-line
  }, [images.length, hasMore, fetchImages]);

  const { loadingRef, isFetching } = useInfiniteScroll(fetchImages, hasMore);

  // Analytics
  const total = images.length;
  const byType: Record<string, number> = {};
  images.forEach(img => {
    const typeName = designTypes.find(dt => dt.id === img.designTypeId)?.name || "غير معروف";
    byType[typeName] = (byType[typeName] || 0) + 1;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Top Bar with Upload Button */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">لوحة المصمم</h1>
          <div className="text-muted-foreground text-sm">معرفك: <span className="font-mono text-primary-700">{clientIdentifier}</span></div>
        </div>
        <Button
          className="btn-primary flex items-center gap-2"
          onClick={() => router.push("/designer/upload")}
        >
          <UploadCloudIcon className="size-5" /> رفع تصاميم جديدة
        </Button>
      </div>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div>
          <label className="block text-xs mb-1">تصفية حسب العميل</label>
          <select
            className="border rounded px-2 py-1"
            value={selectedClient}
            onChange={e => setSelectedClient(e.target.value)}
          >
            <option value="">كل العملاء</option>
            {clients.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1">تصفية حسب النوع</label>
          <select
            className="border rounded px-2 py-1"
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
          >
            <option value="">كل الأنواع</option>
            {designTypes.map(dt => (
              <option key={dt.id} value={dt.id}>{dt.name}</option>
            ))}
          </select>
        </div>
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
      {isFetching && <div className="text-center py-4">جاري التحميل...</div>}
      {hasMore && <div ref={loadingRef} className="h-12" />}
      {!hasMore && images.length > 0 && (
        <div className="text-center text-muted-foreground py-8">تم عرض جميع التصاميم</div>
      )}
      {Array.from(new Map(images.map(img => [img.id, img])).values()).map((img, idx) => (
        <Card key={img.id} className="overflow-hidden rounded-2xl border-0">
          <img src={img.url} alt={designTypes.find(dt => dt.id === img.designTypeId)?.name || "تصميم"} className="w-full h-60 object-cover" />
          <div className="p-4 flex flex-col gap-2">
            <div className="font-bold text-primary">{designTypes.find(dt => dt.id === img.designTypeId)?.name || "غير معروف"}</div>
            <div className="text-xs text-muted-foreground">{img.clientName}</div>
            <div className="text-xs">{new Date(img.createdAt).toLocaleDateString()}</div>
          </div>
        </Card>
      ))}
    </div>
  );
} 