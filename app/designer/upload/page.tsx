"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UploadCloudIcon, FileImageIcon, CheckCircle2Icon, XCircleIcon, ImageIcon, TrashIcon } from "lucide-react";
import Image from "next/image";

const availableClients = [
  { id: "ABC12345", name: "شركة ألف" },
  { id: "XYZ67890", name: "مؤسسة بيت التصميم" },
  { id: "QWE456RT", name: "عميل تجريبي" },
];

const availableTags = ["عرض", "منتج", "منشور اجتماعي"];

interface SelectedFile {
  file: File;
  preview: string;
  tag: string;
}

export default function DesignerUploadPage() {
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  function handleClientSelect(value: string) {
    setSelectedClient(value);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      processFiles(files);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      processFiles(files);
    }
  }

  function processFiles(files: File[]) {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const newFiles: SelectedFile[] = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      tag: "",
    }));
    setSelectedFiles(prev => [...prev, ...newFiles]);
  }

  function handleTagSelect(index: number, tag: string) {
    setSelectedFiles(prev =>
      prev.map((item, i) => (i === index ? { ...item, tag } : item))
    );
  }

  function removeFile(index: number) {
    setSelectedFiles(prev => {
      const updated = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index].preview);
      return updated;
    });
  }

  function canSubmit() {
    return selectedClient && selectedFiles.length > 0 && selectedFiles.every(f => f.tag);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit()) return;

    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      // Clean up
      selectedFiles.forEach(f => URL.revokeObjectURL(f.preview));
      setSelectedFiles([]);
      setSelectedClient("");
    }, 2000);
  }

  const clientName = availableClients.find(c => c.id === selectedClient)?.name || "";

  return (
    <div className="min-h-screen p-4 animate-fade-in w-full">
      <div className="w-full">
        {/* Header Section */}
        <div className="mb-4 text-right">
          <h1 className="text-4xl font-bold heading-elegant mb-2">رفع التصاميم</h1>
          <p className="text-lg text-muted-foreground">
            ارفع تصاميمك الجديدة للعملاء مع تحديد النوع المناسب لكل تصميم
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Selection */}
          <Card className="card-elegant p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-500 rounded-xl flex items-center justify-center shadow">
                  <ImageIcon className="size-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">اختيار العميل</h2>
                  <p className="text-xs text-muted-foreground">حدد العميل الذي ستقوم برفع التصاميم له</p>
                </div>
              </div>
              <Select value={selectedClient} onValueChange={handleClientSelect}>
                <SelectTrigger className="select-elegant">
                  <SelectValue placeholder="اختر العميل..." />
                </SelectTrigger>
                <SelectContent>
                  {availableClients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      <div className="flex items-center gap-2">
                        <Badge className="badge-commented font-mono text-xs">{client.id}</Badge>
                        <span>{client.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedClient && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-2 flex items-center gap-2">
                  <CheckCircle2Icon className="size-4 text-green-600" />
                  <span className="text-green-700 font-medium text-sm">تم اختيار: {clientName}</span>
                </div>
              )}
            </div>
          </Card>
          {/* File Upload Section */}
          <Card className="card-elegant p-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-500 rounded-xl flex items-center justify-center shadow">
                  <UploadCloudIcon className="size-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">رفع الصور</h2>
                  <p className="text-xs text-muted-foreground">اسحب وأفلت الصور أو انقر لاختيارها</p>
                </div>
              </div>
              {/* Drag & Drop Area */}
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer group ${
                  dragActive 
                    ? 'border-primary-400 bg-primary-50 scale-[1.02]' 
                    : 'border-gray-300 hover:border-primary-300 hover:bg-primary-50/50'
                }`}
                onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                <div className="space-y-2">
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
                    dragActive 
                      ? 'bg-primary-500 scale-110' 
                      : 'bg-gray-100 group-hover:bg-primary-100 group-hover:scale-105'
                  }`}>
                    <UploadCloudIcon className={`size-6 transition-colors duration-300 ${
                      dragActive ? 'text-white' : 'text-gray-400 group-hover:text-primary-600'
                    }`} />
                  </div>
                  <div>
                    <p className={`text-base font-medium transition-colors duration-300 ${
                      dragActive ? 'text-primary-700' : 'text-gray-600 group-hover:text-primary-700'
                    }`}>
                      {dragActive ? 'أفلت الصور هنا' : 'اسحب وأفلت الصور أو انقر للاختيار'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      يدعم صيغ: JPG, PNG, GIF, WEBP
                    </p>
                  </div>
                </div>
              </div>
              <Input
                id="fileInput"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </Card>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <Card className="card-elegant p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                      <FileImageIcon className="size-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">الصور المحددة</h2>
                      <p className="text-sm text-muted-foreground">حدد نوع كل صورة قبل الرفع</p>
                    </div>
                  </div>
                  <Badge className="badge-commented">{selectedFiles.length} صورة</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedFiles.map((item, index) => (
                    <Card key={index} className="card-interactive gpu-accelerated group">
                      <div className="relative">
                        <div className="image-container aspect-[4/3]">
                          <Image
                            src={item.preview}
                            alt={`صورة ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="image-overlay" />
                        </div>
                        
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 left-2 z-10 bg-red-500/80 hover:bg-red-600 backdrop-blur-sm"
                          onClick={() => removeFile(index)}
                        >
                          <TrashIcon className="size-4" />
                        </Button>
                      </div>

                      <div className="p-4 space-y-3">
                        <div className="text-sm text-muted-foreground truncate">
                          {item.file.name}
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-foreground">نوع التصميم:</Label>
                          <Select
                            value={item.tag}
                            onValueChange={(value) => handleTagSelect(index, value)}
                          >
                            <SelectTrigger className={`select-elegant ${!item.tag ? 'border-amber-300 bg-amber-50' : ''}`}>
                              <SelectValue placeholder="اختر النوع..." />
                            </SelectTrigger>
                            <SelectContent>
                              {availableTags.map(tag => (
                                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {item.tag && (
                          <div className="flex items-center gap-2 pt-2">
                            <CheckCircle2Icon className="size-4 text-green-600" />
                            <Badge className="badge-approved">{item.tag}</Badge>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Submit Section */}
          <Card className="card-elegant p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-right">
                <h3 className="text-lg font-semibold text-foreground">جاهز للرفع؟</h3>
                <p className="text-sm text-muted-foreground">
                  {!selectedClient ? "اختر العميل أولاً" : 
                   selectedFiles.length === 0 ? "أضف صور للرفع" :
                   !selectedFiles.every(f => f.tag) ? "حدد نوع جميع الصور" :
                   `رفع ${selectedFiles.length} صورة إلى ${clientName}`}
                </p>
              </div>
              
              <Button
                type="submit"
                disabled={!canSubmit() || isUploading}
                className={`btn-primary shadow-luxurious ${!canSubmit() ? 'opacity-50' : ''}`}
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    جاري الرفع...
                  </>
                ) : (
                  <>
                    <UploadCloudIcon className="size-5 mr-2" />
                    رفع التصاميم
                  </>
                )}
              </Button>
            </div>
          </Card>
        </form>

        {/* Success Message */}
        {uploadSuccess && (
          <Card className="card-elegant p-6 mt-8 animate-slide-up">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2Icon className="size-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-green-700 mb-2">تم الرفع بنجاح!</h3>
                <p className="text-green-600">تم رفع جميع التصاميم بنجاح. سيتمكن العميل من مراجعتها الآن.</p>
              </div>
              <Button
                onClick={() => setUploadSuccess(false)}
                className="btn-secondary"
              >
                رفع المزيد
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
} 