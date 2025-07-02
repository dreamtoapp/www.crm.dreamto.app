"use client";
import React from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";

export default function AdminDesignerAnalyticsPage() {
  const params = useParams();
  const designerKey = params?.designerKey as string;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">لوحة تحليلات المصمم</h1>
      <Card className="p-6 mb-8">
        <div className="text-xl font-semibold mb-2">المصمم: {designerKey}</div>
        {/* TODO: Add analytics cards here */}
        <div className="text-muted-foreground">إحصائيات المصمم ستظهر هنا (إجمالي التصاميم، حسب العميل، حسب النوع، نسبة الاعتماد، عدد التعليقات ...)</div>
      </Card>
      <Card className="p-6 mb-8">
        <div className="text-lg font-semibold mb-2">جميع التصاميم المرفوعة بواسطة هذا المصمم</div>
        {/* TODO: Add designs table here */}
        <div className="text-muted-foreground">جدول التصاميم سيظهر هنا</div>
      </Card>
      <Card className="p-6">
        <div className="text-lg font-semibold mb-2">جميع التعليقات على تصاميم هذا المصمم</div>
        {/* TODO: Add comments table here */}
        <div className="text-muted-foreground">جدول التعليقات سيظهر هنا</div>
      </Card>
    </div>
  );
} 