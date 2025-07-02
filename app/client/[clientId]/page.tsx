"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircleIcon, CheckCircle2Icon, ThumbsUpIcon, MessageSquareIcon, FilterIcon } from "lucide-react";

const fakeImages = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    tag: "عرض",
    status: "معلق",
    comments: [],
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
    tag: "منتج",
    status: "معتمد",
    comments: [
      { text: "جميل!", date: "2024-07-01 10:00" },
    ],
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
    tag: "منشور اجتماعي",
    status: "تم التعليق",
    comments: [
      { text: "يرجى تعديل اللون", date: "2024-07-02 15:30" },
    ],
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80",
    tag: "عرض",
    status: "معلق",
    comments: [],
  },
];

const tags = ["الكل", "عرض", "منتج", "منشور اجتماعي"];

type CommentDialogState = { open: boolean; imageId: string | null };
type ViewImageState = { open: boolean; url: string; tag: string };

export default function ClientGalleryPage() {
  const [images, setImages] = useState(fakeImages);
  const [selectedTag, setSelectedTag] = useState("الكل");
  const [commentDialog, setCommentDialog] = useState<CommentDialogState>({ open: false, imageId: null });
  const [comment, setComment] = useState("");
  const [viewImage, setViewImage] = useState<ViewImageState>({ open: false, url: "", tag: "" });

  const filteredImages = selectedTag === "الكل"
    ? images
    : images.filter(img => img.tag === selectedTag);

  function handleApprove(id: string) {
    setImages(imgs =>
      imgs.map(img =>
        img.id === id ? { ...img, status: "معتمد" } : img
      )
    );
  }

  function handleOpenComment(id: string) {
    setCommentDialog({ open: true, imageId: id });
    setComment("");
  }

  function handleSubmitComment() {
    setImages(imgs =>
      imgs.map(img =>
        img.id === commentDialog.imageId
          ? {
              ...img,
              status: "تم التعليق",
              comments: [
                ...img.comments,
                { text: comment, date: new Date().toLocaleString("ar-EG", { hour12: false }) },
              ],
            }
          : img
      )
    );
    setCommentDialog({ open: false, imageId: null });
    setComment("");
  }

  function handleViewImage(url: string, tag: string) {
    setViewImage({ open: true, url, tag });
  }

  function getStatusBadgeClass(status: string) {
    switch (status) {
      case "معتمد": return "badge-approved";
      case "تم التعليق": return "badge-commented";
      case "معلق": return "badge-pending";
      default: return "badge-pending";
    }
  }

  return (
    <div className="min-h-screen p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold heading-elegant mb-3">معرض الصور</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            استعرض التصاميم المخصصة لك، اعتمد الصور التي تناسبك أو أضف تعليقاتك للحصول على التعديلات المطلوبة
          </p>
        </div>

        {/* Filter Section */}
        <Card className="card-elegant mb-8 p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <FilterIcon className="size-5 text-primary-600" />
              <span className="font-medium text-foreground">تصفية حسب النوع:</span>
            </div>
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="select-elegant w-48">
                <SelectValue placeholder="اختر نوع التصميم" />
              </SelectTrigger>
              <SelectContent>
                {tags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredImages.map(img => (
            <Card key={img.id} className="card-interactive gpu-accelerated group">
              {/* Image Container */}
              <div className="image-container aspect-[4/3]" onClick={() => handleViewImage(img.url, img.tag)}>
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
                {img.status === "معتمد" && (
                  <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                    <CheckCircle2Icon className="size-6 text-emerald-600" />
                  </div>
                )}
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

                {/* Comments Count */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageCircleIcon className="size-4" />
                  <span>{img.comments.length} تعليق</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    className={img.status === "معتمد" ? "btn-secondary opacity-50" : "btn-primary"}
                    onClick={() => handleApprove(img.id)}
                    disabled={img.status === "معتمد"}
                    size="sm"
                  >
                    <ThumbsUpIcon className="size-4 mr-2" />
                    اعتماد
                  </Button>
                  <Button
                    className="btn-ghost"
                    onClick={() => handleOpenComment(img.id)}
                    size="sm"
                  >
                    <MessageSquareIcon className="size-4 mr-2" />
                    تعليق
                  </Button>
                </div>

                {/* Comments Display */}
                {img.comments.length > 0 && (
                  <div className="pt-3 border-t border-primary-100 space-y-2">
                    <h4 className="text-sm font-medium text-foreground">التعليقات:</h4>
                    <div className="space-y-2 max-h-24 overflow-y-auto scrollbar-hide">
                      {img.comments.map((c, i) => (
                        <div key={i} className="bg-slate-50 rounded-lg p-3">
                          <p className="text-sm text-foreground">
                            {typeof c === 'string' ? c : c.text}
                          </p>
                          {typeof c === 'object' && c.date && (
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

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <Card className="card-elegant text-center py-12">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FilterIcon className="size-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">لا توجد صور</h3>
              <p className="text-muted-foreground">لا توجد صور متاحة لهذا التصنيف في الوقت الحالي</p>
            </div>
          </Card>
        )}
      </div>

      {/* Comment Dialog */}
      <Dialog open={commentDialog.open} onOpenChange={open => setCommentDialog({ open, imageId: commentDialog.imageId })}>
        <DialogContent className="glass max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-gradient">إضافة تعليق</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="اكتب تعليقك أو اقتراحاتك هنا..."
              className="input-elegant"
            />
          </div>
          <DialogFooter className="gap-3">
            <Button 
              onClick={handleSubmitComment} 
              disabled={!comment.trim()}
              className="btn-primary"
            >
              إرسال التعليق
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setCommentDialog({ open: false, imageId: null })}
              className="btn-ghost"
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image View Dialog */}
      <Dialog open={viewImage.open} onOpenChange={open => setViewImage(v => ({ ...v, open }))}>
        <DialogContent className="glass max-w-4xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-gradient">معاينة التصميم</DialogTitle>
          </DialogHeader>
          {viewImage.url && (
            <div className="space-y-4">
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
              <div className="text-center">
                <Badge className="badge-commented">{viewImage.tag}</Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 