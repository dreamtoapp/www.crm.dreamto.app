"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EyeIcon, FilterIcon, GalleryHorizontalIcon, MessageCircleIcon, CheckCircle2Icon, ClockIcon } from "lucide-react";

// Mock data for clients and their images
const clientImages = {
  "ABC12345": [
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      tag: "عرض",
      status: "معلق",
      uploadDate: "2024-07-01",
      comments: [],
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
      tag: "منتج",
      status: "معتمد",
      uploadDate: "2024-07-02",
      comments: [{ text: "جميل!", date: "2024-07-01 10:00" }],
    },
  ],
  "XYZ67890": [
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
      tag: "منشور اجتماعي",
      status: "تم التعليق",
      uploadDate: "2024-06-30",
      comments: [{ text: "يرجى تعديل اللون", date: "2024-07-02 15:30" }],
    },
  ],
  "QWE456RT": [],
};

const availableClients = [
  { id: "ABC12345", name: "شركة ألف" },
  { id: "XYZ67890", name: "مؤسسة بيت التصميم" },
  { id: "QWE456RT", name: "عميل تجريبي" },
];

const availableTags = ["الكل", "عرض", "منتج", "منشور اجتماعي"];

type ViewImageState = { open: boolean; url: string; tag: string; status: string };

export default function DesignerGalleryPage() {
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedTag, setSelectedTag] = useState("الكل");
  const [viewImage, setViewImage] = useState<ViewImageState>({ open: false, url: "", tag: "", status: "" });

  const currentImages = selectedClient ? (clientImages[selectedClient as keyof typeof clientImages] || []) : [];
  const filteredImages = selectedTag === "الكل"
    ? currentImages
    : currentImages.filter(img => img.tag === selectedTag);

  const clientName = availableClients.find(c => c.id === selectedClient)?.name || "";

  function handleViewImage(url: string, tag: string, status: string) {
    setViewImage({ open: true, url, tag, status });
  }

  function getStatusBadgeClass(status: string) {
    switch (status) {
      case "معتمد": return "badge-approved";
      case "تم التعليق": return "badge-commented";
      case "معلق": return "badge-pending";
      default: return "badge-pending";
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "معتمد": return <CheckCircle2Icon className="size-4" />;
      case "تم التعليق": return <MessageCircleIcon className="size-4" />;
      case "معلق": return <ClockIcon className="size-4" />;
      default: return <ClockIcon className="size-4" />;
    }
  }

  return (
    <div className="min-h-screen p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold heading-elegant mb-3">معرض التصاميم</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            استعرض جميع التصاميم التي قمت برفعها لعملائك وتابع حالة المراجعة والتعليقات
          </p>
        </div>

        {/* Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Client Selection */}
          <Card className="card-elegant p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <GalleryHorizontalIcon className="size-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">اختيار العميل</h3>
                <p className="text-sm text-muted-foreground">عرض تصاميم عميل محدد</p>
              </div>
            </div>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="select-elegant">
                <SelectValue placeholder="اختر العميل..." />
              </SelectTrigger>
              <SelectContent>
                {availableClients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    <div className="flex items-center gap-3">
                      <Badge className="badge-commented font-mono text-xs">{client.id}</Badge>
                      <span>{client.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>

          {/* Tag Filter */}
          <Card className="card-elegant p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <FilterIcon className="size-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">تصفية حسب النوع</h3>
                <p className="text-sm text-muted-foreground">فلترة التصاميم حسب النوع</p>
              </div>
            </div>
            <Select value={selectedTag} onValueChange={setSelectedTag} disabled={!selectedClient}>
              <SelectTrigger className="select-elegant">
                <SelectValue placeholder="اختر نوع التصميم..." />
              </SelectTrigger>
              <SelectContent>
                {availableTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>
        </div>

        {/* Selected Client Info */}
        {selectedClient && (
          <Card className="card-premium p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle2Icon className="size-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{clientName}</h2>
                  <p className="text-sm text-muted-foreground">معرف العميل: {selectedClient}</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600">{currentImages.length}</p>
                <p className="text-sm text-muted-foreground">إجمالي التصاميم</p>
              </div>
            </div>
          </Card>
        )}

        {/* Gallery Grid */}
        {!selectedClient ? (
          <Card className="card-elegant text-center py-16">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GalleryHorizontalIcon className="size-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">اختر عميلاً لعرض تصاميمه</h3>
              <p className="text-muted-foreground">حدد عميلاً من القائمة أعلاه لاستعراض جميع التصاميم المرفوعة له</p>
            </div>
          </Card>
        ) : filteredImages.length === 0 ? (
          <Card className="card-elegant text-center py-16">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FilterIcon className="size-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">لا توجد تصاميم</h3>
              <p className="text-muted-foreground">
                {selectedTag === "الكل" 
                  ? "لم يتم رفع أي تصاميم لهذا العميل بعد"
                  : `لا توجد تصاميم من نوع "${selectedTag}" لهذا العميل`
                }
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredImages.map(img => (
              <Card key={img.id} className="card-interactive gpu-accelerated group">
                {/* Image Container */}
                <div className="image-container aspect-[4/3]" onClick={() => handleViewImage(img.url, img.tag, img.status)}>
                  <Image
                    src={img.url}
                    alt={img.tag}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    priority={false}
                  />
                  <div className="image-overlay" />
                  
                  {/* Status Indicator Overlay */}
                  <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                    {getStatusIcon(img.status)}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  {/* Status and Tag Row */}
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusBadgeClass(img.status)}>
                      {img.status}
                    </Badge>
                    <span className="text-sm font-medium text-muted-foreground bg-slate-100 px-3 py-1 rounded-full">
                      {img.tag}
                    </span>
                  </div>

                  {/* Upload Date */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ClockIcon className="size-4" />
                    <span>رُفع في {img.uploadDate}</span>
                  </div>

                  {/* Comments Count */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageCircleIcon className="size-4" />
                    <span>{img.comments.length} تعليق</span>
                  </div>

                  {/* View Button */}
                  <Button
                    onClick={() => handleViewImage(img.url, img.tag, img.status)}
                    className="btn-ghost w-full"
                    size="sm"
                  >
                    <EyeIcon className="size-4 mr-2" />
                    عرض التفاصيل
                  </Button>

                  {/* Comments Display */}
                  {img.comments.length > 0 && (
                    <div className="pt-3 border-t border-primary-100 space-y-2">
                      <h4 className="text-sm font-medium text-foreground">آخر التعليقات:</h4>
                      <div className="space-y-2 max-h-20 overflow-y-auto scrollbar-hide">
                        {img.comments.slice(-1).map((c, i) => (
                          <div key={i} className="bg-slate-50 rounded-lg p-3">
                            <p className="text-sm text-foreground">{c.text}</p>
                            {c.date && (
                              <p className="text-xs text-muted-foreground mt-1">{c.date}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Image View Dialog */}
      <Dialog open={viewImage.open} onOpenChange={open => setViewImage(v => ({ ...v, open }))}>
        <DialogContent className="glass max-w-4xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-gradient text-xl">معاينة التصميم</DialogTitle>
          </DialogHeader>
          {viewImage.url && (
            <div className="space-y-6">
              <div className="relative w-full h-[70vh] bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden">
                <Image
                  src={viewImage.url}
                  alt={viewImage.tag}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority={true}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge className="badge-commented">{viewImage.tag}</Badge>
                  <Badge className={getStatusBadgeClass(viewImage.status)}>
                    {viewImage.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  العميل: {clientName}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 