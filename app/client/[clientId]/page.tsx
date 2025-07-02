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
import { useParams } from "next/navigation";
import { toast } from 'sonner';

type CommentDialogState = { open: boolean; imageId: string | null };
type ViewImageState = { open: boolean; url: string; tag: string };

export default function ClientGalleryPage() {
  const params = useParams();
  const clientId = params?.clientId as string;
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState("الكل");
  const [commentDialog, setCommentDialog] = useState<CommentDialogState>({ open: false, imageId: null });
  const [comment, setComment] = useState("");
  const [viewImage, setViewImage] = useState<ViewImageState>({ open: false, url: "", tag: "" });
  const [showSkeleton, setShowSkeleton] = useState(true);

  React.useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    setShowSkeleton(true);
    fetch(`/api/images?clientId=${encodeURIComponent(clientId)}`)
      .then(res => res.json())
      .then(data => {
        setImages(Array.isArray(data) ? data : []);
        setLoading(false);
        setTimeout(() => setShowSkeleton(false), 600);
      })
      .catch(() => {
        setLoading(false);
        setShowSkeleton(false);
      });
  }, [clientId]);

  const filteredImages = selectedTag === "الكل"
    ? images
    : images.filter(img => img.tag === selectedTag);

  function handleApprove(id: string) {
    setImages(imgs =>
      imgs.map(img =>
        img.id === id ? { ...img, status: "معتمد" } : img
      )
    );
    toast.success("تم اعتماد التصميم بنجاح!");
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
    toast.success("تم إرسال التعليق بنجاح!");
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
                {["الكل", "عرض", "منتج", "منشور اجتماعي"].map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Gallery Grid */}
        {loading || showSkeleton ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse h-80 bg-slate-100 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredImages.map(img => (
              <Card key={img.id} className="card-interactive gpu-accelerated group transition-transform duration-200 hover:scale-[1.025] hover:shadow-xl rounded-2xl border border-border/60">
                {/* Image Container */}
                <div className="image-container aspect-[4/3] cursor-pointer relative" onClick={() => handleViewImage(img.url, img.tag)} aria-label="عرض الصورة بالحجم الكامل" tabIndex={0} role="button">
                  <Image
                    src={img.url}
                    alt={img.tag || img.designType || 'تصميم'}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500 rounded-t-2xl"
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
                <div className="p-4 space-y-3">
                  {/* Status and Tag Row */}
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusBadgeClass(img.status)}>{img.status}</Badge>
                    <span className="text-xs font-medium text-muted-foreground bg-slate-100 px-2 py-1 rounded-full border border-slate-200">{img.tag}</span>
                  </div>
                  {/* Comments Count */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MessageCircleIcon className="size-4" />
                    <span>{img.comments.length} تعليق</span>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-1">
                    <Button
                      className={img.status === "معتمد" ? "btn-secondary opacity-50" : "btn-primary"}
                      onClick={() => handleApprove(img.id)}
                      disabled={img.status === "معتمد"}
                      size="sm"
                      aria-label="اعتماد التصميم"
                      title={img.status === "معتمد" ? "تم اعتماد هذا التصميم بالفعل" : "اعتماد التصميم"}
                    >
                      <ThumbsUpIcon className="size-4 mr-1" />
                      اعتماد
                    </Button>
                    <Button
                      className="btn-ghost"
                      onClick={() => handleOpenComment(img.id)}
                      size="sm"
                      aria-label="إضافة تعليق"
                    >
                      <MessageSquareIcon className="size-4 mr-1" />
                      تعليق
                    </Button>
                  </div>
                  {/* Comments Display */}
                  {img.comments.length > 0 && (
                    <div className="pt-2 border-t border-primary-100 space-y-2">
                      <h4 className="text-xs font-medium text-foreground">التعليقات:</h4>
                      <div className="space-y-2 max-h-20 overflow-y-auto scrollbar-hide pr-1">
                        {img.comments.map((c: any, i: number) => (
                          <div key={i} className="bg-slate-50 rounded-lg p-2">
                            <p className="text-xs text-foreground">
                              {typeof c === 'string' ? c : c.text}
                            </p>
                            {typeof c === 'object' && c.date && (
                              <p className="text-[10px] text-muted-foreground mt-1">{c.date}</p>
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

        {/* Empty State */}
        {filteredImages.length === 0 && !loading && !showSkeleton && (
          <Card className="card-elegant text-center py-16 animate-fade-in">
            <div className="max-w-sm mx-auto flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                <FilterIcon className="size-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-1">لا توجد صور متاحة</h3>
              <p className="text-muted-foreground">لم يتم رفع أي تصاميم لهذا التصنيف بعد. سيتم عرض التصاميم هنا عند توفرها.</p>
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
              <div className="relative w-full h-[60vh] bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden">
                <Image
                  src={viewImage.url}
                  alt={viewImage.tag || 'تصميم'}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority={true}
                />
              </div>
              <div className="flex flex-col items-center gap-2">
                <Badge className="badge-commented">{viewImage.tag}</Badge>
                {/* Show status and comments in modal */}
                {filteredImages.find(img => img.url === viewImage.url) && (
                  <>
                    <span className="text-xs text-muted-foreground">الحالة: {filteredImages.find(img => img.url === viewImage.url)?.status}</span>
                    <div className="w-full max-w-md mx-auto mt-2">
                      <h4 className="text-xs font-medium text-foreground mb-1">التعليقات:</h4>
                      <div className="space-y-2 max-h-24 overflow-y-auto scrollbar-hide pr-1">
                        {(filteredImages.find(img => img.url === viewImage.url)?.comments || []).map((c: any, i: number) => (
                          <div key={i} className="bg-slate-50 rounded-lg p-2">
                            <p className="text-xs text-foreground">{typeof c === 'string' ? c : c.text}</p>
                            {typeof c === 'object' && c.date && (
                              <p className="text-[10px] text-muted-foreground mt-1">{c.date}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 