"use client";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AdminClientsPage from "./clients/page";
import AdminDesignersPage from "./designers/page";
// Placeholder imports for designers and design types
// You will implement these components next
// import AdminDesignersPage from "./designers/page";
// import AdminDesignTypesPage from "./design-types/page";

export default function AdminDashboardPage() {
  const [tab, setTab] = useState("clients");
  return (
    <div className="min-h-screen p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">لوحة تحكم الإدارة</h1>
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="flex justify-center gap-4 mb-8">
            <TabsTrigger value="clients">العملاء</TabsTrigger>
            <TabsTrigger value="designers">المصممين</TabsTrigger>
            <TabsTrigger value="designTypes">أنواع التصاميم</TabsTrigger>
          </TabsList>
          <TabsContent value="clients">
            <AdminClientsPage />
          </TabsContent>
          <TabsContent value="designers">
            <AdminDesignersPage />
          </TabsContent>
          <TabsContent value="designTypes">
            {/* TODO: Implement AdminDesignTypesPage */}
            <div className="text-center text-muted-foreground py-12">إدارة أنواع التصاميم (قريبًا)</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 