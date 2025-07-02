"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EyeIcon, MessageCircleIcon, CheckCircle2Icon, FilterIcon, ImageIcon, UsersIcon } from "lucide-react";

// Mock data
const mockImages = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    clientName: "شركة ألف",
    clientId: "ABC12345",
    tag: "عرض",
    status: "معلق",
    uploader: "أحمد المصمم",
    uploadDate: "2024-07-01",
    feedbackCount: 0,
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    clientName: "شركة ألف",
    clientId: "ABC12345",
    tag: "منتج",
    status: "معتمد",
    uploader: "سارة المصممة",
    uploadDate: "2024-07-02",
    feedbackCount: 1,
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    clientName: "مؤسسة بيت التصميم",
    clientId: "XYZ67890",
    tag: "منشور اجتماعي",
    status: "تم التعليق",
    uploader: "محمد الفنان",
    uploadDate: "2024-06-30",
    feedbackCount: 2,
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
    clientName: "عميل تجريبي",
    clientId: "QWE456RT",
    tag: "عرض",
    status: "مرفوض",
    uploader: "ليلى المبدعة",
    uploadDate: "2024-06-25",
    feedbackCount: 3,
  },
];

const statusFilters = [
  { label: "الكل", value: "all", count: mockImages.length },
  { label: "معتمد", value: "معتمد", count: mockImages.filter(img => img.status === "معتمد").length },
  { label: "معلق", value: "معلق", count: mockImages.filter(img => img.status === "معلق").length },
  { label: "تم التعليق", value: "تم التعليق", count: mockImages.filter(img => img.status === "تم التعليق").length },
  { label: "مرفوض", value: "مرفوض", count: mockImages.filter(img => img.status === "مرفوض").length },
];

type ViewImageState = { open: boolean; image: typeof mockImages[0] | null };

export default function AdminImagesPage() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewImage, setViewImage] = useState<ViewImageState>({ open: false, image: null });

  const filteredImages = selectedStatus === "all"
    ? mockImages
    : mockImages.filter(img => img.status === selectedStatus);

  function getStatusBadgeClass(status: string) {
    switch (status) {
      case "معتمد": return "badge-approved";
      case "تم التعليق": return "badge-commented";
      case "معلق": return "badge-pending";
      case "مرفوض": return "badge-rejected";
      default: return "badge-pending";
    }
  }

  function getFilterBadgeClass(status: string, isActive: boolean) {
    if (!isActive) return "cursor-pointer border-gray-200 bg-white hover:bg-gray-50 text-gray-600";
    
    switch (status) {
      case "معتمد": return "cursor-pointer bg-emerald-50 border-emerald-200 text-emerald-700";
      case "تم التعليق": return "cursor-pointer bg-blue-50 border-blue-200 text-blue-700";
      case "معلق": return "cursor-pointer bg-amber-50 border-amber-200 text-amber-700";
      case "مرفوض": return "cursor-pointer bg-red-50 border-red-200 text-red-700";
      default: return "cursor-pointer bg-primary-50 border-primary-200 text-primary-700";
    }
  }

  function handleViewImage(image: typeof mockImages[0]) {
    setViewImage({ open: true, image });
  }

  return (
    <div className="min-h-screen p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold heading-elegant mb-2">إدارة الصور</h1>
          <p className="text-lg text-muted-foreground">
            استعراض وإدارة جميع الصور المرفوعة من المصممين للعملاء
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-premium p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <ImageIcon className="size-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الصور</p>
                <p className="text-2xl font-bold text-foreground">{mockImages.length}</p>
              </div>
            </div>
          </Card>
          <Card className="card-premium p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle2Icon className="size-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">معتمدة</p>
                <p className="text-2xl font-bold text-foreground">{mockImages.filter(img => img.status === "معتمد").length}</p>
              </div>
            </div>
          </Card>
          <Card className="card-premium p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <MessageCircleIcon className="size-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">بحاجة مراجعة</p>
                <p className="text-2xl font-bold text-foreground">{mockImages.filter(img => img.status === "معلق" || img.status === "تم التعليق").length}</p>
              </div>
            </div>
          </Card>
          <Card className="card-premium p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <UsersIcon className="size-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">عدد العملاء</p>
                <p className="text-2xl font-bold text-foreground">{new Set(mockImages.map(img => img.clientId)).size}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Status Filter */}
        <Card className="card-elegant p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <FilterIcon className="size-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">تصفية حسب الحالة</h2>
              <p className="text-sm text-muted-foreground">اختر حالة الصور لعرضها</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {statusFilters.map(filter => (
              <Badge
                key={filter.value}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${getFilterBadgeClass(filter.value, selectedStatus === filter.value)}`}
                onClick={() => setSelectedStatus(filter.value)}
              >
                {filter.label}
                <span className="ml-2 bg-current text-white rounded-full px-2 py-0.5 text-xs">
                  {filter.count}
                </span>
              </Badge>
            ))}
          </div>
        </Card>

        {/* Images Table */}
        <Card className="card-elegant shadow-luxurious">
          <div className="p-6 border-b border-primary-100">
            <h2 className="text-xl font-semibold text-foreground">جدول الصور</h2>
            <p className="text-sm text-muted-foreground mt-1">
              عرض {filteredImages.length} من {mockImages.length} صورة
            </p>
          </div>
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader className="bg-gradient-to-r from-primary-50 to-secondary-50">
                <TableRow className="border-b border-primary-200">
                  <TableHead className="text-right font-semibold text-primary-700 py-4">معاينة</TableHead>
                  <TableHead className="text-right font-semibold text-primary-700">العميل</TableHead>
                  <TableHead className="text-right font-semibold text-primary-700">النوع</TableHead>
                  <TableHead className="text-right font-semibold text-primary-700">الحالة</TableHead>
                  <TableHead className="text-right font-semibold text-primary-700">المصمم</TableHead>
                  <TableHead className="text-right font-semibold text-primary-700">تاريخ الرفع</TableHead>
                  <TableHead className="text-right font-semibold text-primary-700">التعليقات</TableHead>
                  <TableHead className="text-center font-semibold text-primary-700 w-32">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredImages.map((image, index) => (
                  <TableRow key={image.id} className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-transparent transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                    <TableCell className="py-4">
                      <div 
                        className="image-container w-16 h-16 cursor-pointer group"
                        onClick={() => handleViewImage(image)}
                      >
                        <Image
                          src={image.url}
                          alt={image.tag}
                          fill
                          sizes="64px"
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="image-overlay" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{image.clientName}</p>
                        <Badge className="badge-commented font-mono text-xs mt-1">{image.clientId}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-muted-foreground bg-slate-100 px-3 py-1 rounded-full">
                        {image.tag}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeClass(image.status)}>
                        {image.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{image.uploader}</TableCell>
                    <TableCell className="text-muted-foreground">{image.uploadDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MessageCircleIcon className="size-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{image.feedbackCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-center">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="hover:bg-blue-50 hover:text-blue-600 transition-colors p-2" 
                          aria-label="عرض الصورة"
                          onClick={() => handleViewImage(image)}
                        >
                          <EyeIcon className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <Card className="card-elegant text-center py-16 mt-8">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FilterIcon className="size-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">لا توجد صور</h3>
              <p className="text-muted-foreground">لا توجد صور متاحة لهذا الفلتر في الوقت الحالي</p>
            </div>
          </Card>
        )}
      </div>

      {/* Image View Dialog */}
      <Dialog open={viewImage.open} onOpenChange={open => setViewImage({ open, image: viewImage.image })}>
        <DialogContent className="glass max-w-4xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-gradient text-xl">معاينة الصورة</DialogTitle>
          </DialogHeader>
          {viewImage.image && (
            <div className="space-y-6">
              <div className="relative w-full h-[70vh] bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden">
                <Image
                  src={viewImage.image.url}
                  alt={viewImage.image.tag}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority={true}
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">العميل</p>
                  <div>
                    <p className="font-medium text-foreground">{viewImage.image.clientName}</p>
                    <Badge className="badge-commented font-mono text-xs">{viewImage.image.clientId}</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">النوع</p>
                  <Badge className="badge-commented">{viewImage.image.tag}</Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">الحالة</p>
                  <Badge className={getStatusBadgeClass(viewImage.image.status)}>
                    {viewImage.image.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">المصمم</p>
                  <p className="text-foreground">{viewImage.image.uploader}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 