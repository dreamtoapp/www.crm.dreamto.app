"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface GalleryInfiniteScrollProps {
  initialImages: any[];
  typeId: string;
  clientId: string;
}

export default function GalleryInfiniteScroll({ initialImages, typeId, clientId }: GalleryInfiniteScrollProps) {
  const [images, setImages] = useState<any[]>(initialImages);
  const [page, setPage] = useState(2); // Already loaded page 1
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  // Deduplicate images by id
  const dedupedImages = Array.from(
    new Map(images.map(img => [img.id, img])).values()
  );

  // Infinite scroll logic
  useEffect(() => {
    if (!hasMore || loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          fetchMoreImages();
        }
      },
      { threshold: 0.1 }
    );
    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }
    return () => {
      if (loadingRef.current) observer.unobserve(loadingRef.current);
    };
    // eslint-disable-next-line
  }, [loading, hasMore, typeId, clientId]);

  const fetchImages = useCallback(async (reset = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", reset ? "1" : String(page));
      params.set("limit", "20");
      if (typeId) params.set("designType", typeId);
      if (clientId) params.set("client", clientId);
      const res = await fetch(`/api/images?${params.toString()}`);
      const data = await res.json();
      if (Array.isArray(data.images) && data.images.length > 0) {
        setImages(prev => reset ? data.images : [...prev, ...data.images]);
        setPage(prev => reset ? 2 : prev + 1);
        setHasMore(data.hasMore);
      } else {
        if (reset) setImages([]);
        setHasMore(false);
      }
    } catch {
      if (reset) setImages([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, typeId, clientId]);

  // When filters change, refetch images and reset pagination
  useEffect(() => {
    fetchImages(true);
    // eslint-disable-next-line
  }, [typeId, clientId]);

  const fetchMoreImages = useCallback(() => {
    fetchImages(false);
  }, [fetchImages]);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {dedupedImages.map((img, i) => (
          <Card key={img.id} className="overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group bg-card border-0">
            <div className="relative aspect-[4/3] bg-muted flex items-center justify-center overflow-hidden">
              <Image
                src={img.url}
                alt={img.designType?.name || 'Design'}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs shadow">
                  {img.designType?.name || 'Design'}
                </Badge>
              </div>
            </div>
            <div className="p-4 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8 bg-primary/10 text-primary font-bold">
                  <AvatarFallback>{(img.clientName || img.client?.name || 'C')[0]}</AvatarFallback>
                </Avatar>
                <div className="font-semibold text-primary truncate">{img.clientName || img.client?.name || 'Client'}</div>
              </div>
              <div className="flex flex-col gap-1 mt-2 text-xs text-muted-foreground">
                <div>
                  <span className="font-semibold text-foreground">Uploaded:</span> {img.createdAt ? new Date(img.createdAt).toLocaleDateString() : "Unknown"}
                </div>
                <div>
                  <span className="font-semibold text-foreground">Size:</span> {img.width && img.height ? `${img.width}x${img.height}` : "Unknown"}
                </div>
              </div>
            </div>
          </Card>
        ))}
        {/* Loading skeletons */}
        {loading && Array.from({ length: 4 }).map((_, i) => (
          <Card key={"skeleton-" + i} className="overflow-hidden rounded-2xl shadow-lg bg-card border-0">
            <div className="relative aspect-[4/3] bg-muted animate-pulse">
              {/* Image skeleton */}
              <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 animate-pulse" />
              {/* Badge skeleton */}
              <div className="absolute top-2 left-2">
                <div className="w-16 h-6 bg-muted-foreground/20 rounded-full animate-pulse" />
              </div>
            </div>
            <div className="p-4 flex flex-col gap-2">
              {/* Avatar and name skeleton */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-muted-foreground/20 rounded-full animate-pulse" />
                <div className="h-4 bg-muted-foreground/20 rounded w-24 animate-pulse" />
              </div>
              {/* Text skeletons */}
              <div className="flex flex-col gap-1 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-3 bg-muted-foreground/20 rounded animate-pulse" />
                  <div className="w-20 h-3 bg-muted-foreground/20 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-3 bg-muted-foreground/20 rounded animate-pulse" />
                  <div className="w-16 h-3 bg-muted-foreground/20 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </Card>
        ))}
        {/* Infinite scroll loading indicator */}
        <div ref={loadingRef} className="col-span-full flex justify-center items-center py-6 min-h-[40px]">
          {loading && <span className="text-muted-foreground">Loading more...</span>}
          {!hasMore && dedupedImages.length > 0 && (
            <span className="text-muted-foreground">No more images to show.</span>
          )}
        </div>
      </div>
    </div>
  );
} 