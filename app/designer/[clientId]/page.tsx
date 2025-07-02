"use client";
import React from "react";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GalleryHorizontalIcon, UploadCloudIcon } from "lucide-react";

export default function DesignerDashboardPage() {
  const router = useRouter();
  // Unwrap params using useParams (Next.js 15+)
  const params = useParams();
  const clientId = params?.clientId as string;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <Card className="w-full max-w-md p-8 flex flex-col gap-6 items-center text-center">
        <h1 className="text-3xl font-bold mb-2">مرحباً أيها المصمم!</h1>
        <p className="text-lg text-muted-foreground mb-4">
          معرفك: <span className="font-mono text-primary-700">{clientId}</span>
        </p>
        <div className="flex flex-col gap-4 w-full">
          <Button
            className="btn-primary flex items-center gap-2 justify-center w-full"
            onClick={() => router.push("/designer/gallery")}
          >
            <GalleryHorizontalIcon className="size-5" />
            معرض التصاميم
          </Button>
          <Button
            className="btn-secondary flex items-center gap-2 justify-center w-full"
            onClick={() => router.push("/designer/upload")}
          >
            <UploadCloudIcon className="size-5" />
            رفع تصاميم جديدة
          </Button>
        </div>
      </Card>
    </div>
  );
} 