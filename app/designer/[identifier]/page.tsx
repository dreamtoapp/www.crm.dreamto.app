"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { GalleryHorizontalIcon, ImageIcon, CalendarIcon, MessageCircleIcon, DownloadIcon, UserIcon, InfoIcon, FileIcon, RulerIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { XCircleIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from "@/components/ui/dialog";

// Example: You may need to adjust the fetch logic to match your API
export default function DesignerHomePage() {
  const params = useParams();
  const identifier = Array.isArray(params.identifier) ? params.identifier[0] : params.identifier;
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<{ id: string; name?: string; identifier?: string; key?: string }[]>([]);
  const [designTypes, setDesignTypes] = useState<{ id: string; name: string }[]>([]);
  const [selectedClient, setSelectedClient] = useState("all");
  const [selectedDesignType, setSelectedDesignType] = useState("all");
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [openImage, setOpenImage] = useState<any | null>(null);

  useEffect(() => {
    async function fetchFilters() {
      setFiltersLoading(true);
      try {
        const [clientsRes, designTypesRes] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/design-types"),
        ]);
        const clientsData = await clientsRes.json();
        console.log('clientsData', clientsData);
        const designTypesData = await designTypesRes.json();
        setClients(clientsData);
        setDesignTypes(designTypesData);
      } finally {
        setFiltersLoading(false);
      }
    }
    fetchFilters();
  }, []);

  useEffect(() => {
    if (!identifier) return;
    setLoading(true);
    const params = new URLSearchParams();
    params.append("uploaderIdentifier", identifier);
    if (selectedClient && selectedClient !== "all") params.append("clientId", selectedClient);
    if (selectedDesignType && selectedDesignType !== "all") params.append("designTypeId", selectedDesignType);
    fetch(`/api/images?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setImages(data.images || []);
        setLoading(false);
      });
  }, [identifier, selectedClient, selectedDesignType]);

  const clearFilters = () => {
    setSelectedClient("all");
    setSelectedDesignType("all");
  };

  return (
    <div className="min-h-screen p-4 animate-fade-in w-full" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">معرض تصاميمي</h1>
          <p className="text-base text-muted-foreground">هنا تجد جميع تصاميمك المرفوعة مع تفاصيلها</p>
        </div>
        <Link href={`/designer/${identifier}/upload`}>
          <Button variant="default" size="lg" className="gap-2 rtl:flex-row-reverse">
            <UploadIcon className="size-5" />
            رفع تصميم جديد
          </Button>
        </Link>
      </div>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center mb-8">
        <Select value={selectedClient} onValueChange={setSelectedClient} disabled={filtersLoading}>
          <SelectTrigger className="min-w-[160px]">
            <SelectValue placeholder="كل العملاء" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل العملاء</SelectItem>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>{client.name || client.identifier || client.key}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedDesignType} onValueChange={setSelectedDesignType} disabled={filtersLoading}>
          <SelectTrigger className="min-w-[160px]">
            <SelectValue placeholder="كل الأنواع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الأنواع</SelectItem>
            {designTypes.map((dt) => (
              <SelectItem key={dt.id} value={dt.id}>{dt.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(selectedClient !== "all" || selectedDesignType !== "all") && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 rtl:flex-row-reverse">
            <XCircleIcon className="size-4" />
            مسح الفلاتر
          </Button>
        )}
      </div>
      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-72 flex flex-col">
              <Skeleton className="h-40 w-full rounded-xl mb-4" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/3 mb-2" />
              <Skeleton className="h-4 w-1/4" />
            </Card>
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground gap-4">
          <GalleryHorizontalIcon className="size-16 text-gray-300 mb-2" />
          <h2 className="text-2xl font-bold">لا توجد تصاميم بعد</h2>
          <p className="text-base">ابدأ برفع أول تصميم لك الآن!</p>
          <Link href={`/designer/${identifier}/upload`}>
            <Button variant="default" size="lg" className="gap-2 rtl:flex-row-reverse">
              <UploadIcon className="size-5" />
              رفع تصميم جديد
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((img) => {
            const typeName = img.designTypeName || designTypes.find(dt => dt.id === img.designTypeId)?.name || "نوع غير معروف";
            return (
              <Dialog key={img.id} open={openImage?.id === img.id} onOpenChange={open => setOpenImage(open ? img : null)}>
                <Card className="h-80 flex flex-col shadow-md hover:shadow-lg transition-shadow group overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between gap-2 p-3 pb-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary">{img.clientName || "عميل غير معروف"}</Badge>
                      <Badge>{typeName}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 cursor-pointer" title={img.publicId}><InfoIcon className="size-4" /></span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 relative">
                    <DialogTrigger asChild>
                      <div className="relative w-full h-40 bg-gray-100 rounded-t-xl overflow-hidden flex items-center justify-center cursor-zoom-in">
                        {img.url ? (
                          <img src={img.url} alt={img.publicId} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
                        ) : (
                          <ImageIcon className="size-12 text-gray-300" />
                        )}
                        <span className="absolute bottom-2 left-2 bg-white/80 rounded px-2 py-1 text-xs text-primary-700 shadow">عرض كامل</span>
                      </div>
                    </DialogTrigger>
                    {/* Technical Info in Card */}
                    {(img.format || img.bytes || (img.width && img.height)) && (
                      <div className="flex flex-row items-center gap-4 px-4 py-2 text-xs text-gray-600">
                        {img.format && (
                          <div className="flex items-center gap-1">
                            <FileIcon className="size-4" />
                            <span>{img.format.toUpperCase()}</span>
                          </div>
                        )}
                        {img.bytes && (
                          <div className="flex items-center gap-1">
                            <FileIcon className="size-4" />
                            <span>{(img.bytes / 1024 < 1024 ? (img.bytes / 1024).toFixed(1) + ' KB' : (img.bytes / 1024 / 1024).toFixed(2) + ' MB')}</span>
                          </div>
                        )}
                        {img.width && img.height && (
                          <div className="flex items-center gap-1">
                            <RulerIcon className="size-4" />
                            <span>{img.width}×{img.height}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-row items-center justify-between gap-2 px-4 py-2 bg-white/80 mt-auto">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <UserIcon className="size-4" />
                      {img.uploader?.name || img.uploader?.identifier || "—"}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <CalendarIcon className="size-4" />
                      {img.createdAt ? new Date(img.createdAt).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" }) : "—"}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MessageCircleIcon className="size-4" />
                      {img.comments?.length || 0}
                    </div>
                  </CardFooter>
                </Card>
                <DialogContent className="max-w-2xl w-full p-0 overflow-hidden">
                  <DialogHeader className="p-4 pb-0">
                    <DialogTitle className="text-xl font-bold">عرض التصميم</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                      <span className="font-bold">{img.clientName || "عميل غير معروف"}</span> •
                      <span className="mx-1">{typeName}</span> •
                      <span className="mx-1">{img.uploader?.name || img.uploader?.identifier || "—"}</span>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="w-full bg-black flex items-center justify-center">
                    {img.url ? (
                      <img src={img.url} alt={img.publicId} className="max-h-[70vh] w-auto object-contain mx-auto" />
                    ) : (
                      <ImageIcon className="size-24 text-gray-300 mx-auto my-12" />
                    )}
                  </div>
                  <div className="flex flex-row items-center justify-between gap-4 p-4 border-t bg-white">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <CalendarIcon className="size-4" />
                      {img.createdAt ? new Date(img.createdAt).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" }) : "—"}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MessageCircleIcon className="size-4" />
                      {img.comments?.length || 0}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <InfoIcon className="size-4" />
                      {img.publicId}
                    </div>
                  </div>
                  {/* Technical Info */}
                  {(img.format || img.bytes || (img.width && img.height)) && (
                    <div className="flex flex-row items-center gap-6 p-4 pt-2 border-t bg-white text-xs text-gray-600">
                      {img.format && (
                        <div className="flex items-center gap-1">
                          <FileIcon className="size-4" />
                          <span>{img.format.toUpperCase()}</span>
                        </div>
                      )}
                      {img.bytes && (
                        <div className="flex items-center gap-1">
                          <FileIcon className="size-4" />
                          <span>{(img.bytes / 1024 < 1024 ? (img.bytes / 1024).toFixed(1) + ' KB' : (img.bytes / 1024 / 1024).toFixed(2) + ' MB')}</span>
                        </div>
                      )}
                      {img.width && img.height && (
                        <div className="flex items-center gap-1">
                          <RulerIcon className="size-4" />
                          <span>{img.width}×{img.height}</span>
                        </div>
                      )}
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
      )}
    </div>
  );
} 