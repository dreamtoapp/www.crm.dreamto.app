"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AdminClientsPage from "./clients/page";
import AdminDesignersPage from "./designers/page";
import AdminDesignTypesPage from "./design-types/page";
import { Card } from "@/components/ui/card";
import { UsersIcon, SparklesIcon, GalleryHorizontalIcon, ImageIcon } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ 
    clients: 0, 
    designers: 0, 
    types: 0, 
    totalImages: 0,
    loading: true 
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [clientsRes, designersRes, typesRes, imagesRes] = await Promise.all([
          fetch("/api/users?role=CLIENT"),
          fetch("/api/users?role=DESIGNER"),
          fetch("/api/design-types"),
          fetch("/api/images?page=1&limit=1"), // Just to get total count
        ]);
        
        const clients = await clientsRes.json();
        const designers = await designersRes.json();
        const types = await typesRes.json();
        const images = await imagesRes.json();
        
        setStats({
          clients: clients.length,
          designers: designers.length,
          types: types.types?.length || 0,
          totalImages: images.total || 0,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">لوحة تحكم الإدارة</h1>
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <UsersIcon className="size-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي العملاء</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.loading ? '...' : stats.clients}
              </p>
            </div>
          </Card>
          <Card className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <SparklesIcon className="size-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي المصممين</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.loading ? '...' : stats.designers}
              </p>
            </div>
          </Card>
          <Card className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <GalleryHorizontalIcon className="size-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">أنواع التصاميم</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.loading ? '...' : stats.types}
              </p>
            </div>
          </Card>
          <Card className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <ImageIcon className="size-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي الصور</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.loading ? '...' : stats.totalImages}
              </p>
            </div>
          </Card>
        </div>
        {/* Tabs for management */}
        <Tabs defaultValue="clients" className="w-full">
          <TabsList className="flex justify-center gap-4 mb-8">
            <TabsTrigger value="clients">العملاء</TabsTrigger>
            <TabsTrigger value="designers">المصممين</TabsTrigger>
            <TabsTrigger value="types">أنواع التصاميم</TabsTrigger>
          </TabsList>
          <TabsContent value="clients">
            <AdminClientsPage />
          </TabsContent>
          <TabsContent value="designers">
            <AdminDesignersPage />
          </TabsContent>
          <TabsContent value="types">
            <AdminDesignTypesPage />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 