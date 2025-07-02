"use client";
import React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarFooter
} from "./ui/sidebar";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "./ui/navigation-menu";
import { Card } from "./ui/card";
import { UserIcon, UsersIcon, ImageIcon, UploadIcon, GalleryHorizontalIcon, SparklesIcon, LogInIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { toast } from 'sonner';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [userId, setUserId] = React.useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    if (userId.startsWith("C")) {
      router.push(`/client/${userId}`);
    } else if (userId.startsWith("D")) {
      router.push(`/designer/${userId}`);
    } else if (userId.startsWith("A")) {
      router.push(`/admin/clients`);
    } else {
      toast.error("معرف غير صالح. الرجاء إدخال معرف صحيح.");
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navbar */}
      <nav dir="rtl" className="w-full flex items-center justify-between px-4 md:px-8 py-3 border-b bg-white shadow-sm">
        {/* Branding/Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-800 rounded-xl flex items-center justify-center shadow">
            <SparklesIcon className="size-5 text-white" />
          </div>
          <div className="text-right">
            <h1 className="text-lg font-extrabold leading-tight text-gray-900">نظام معرض العملاء</h1>
            <p className="text-xs text-gray-500 font-medium">إدارة التصاميم والمراجعة</p>
          </div>
        </div>
        {/* Login Form at End */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full max-w-xs md:max-w-sm justify-end">
          <button
            type="submit"
            className="flex items-center justify-center gap-1 bg-blue-700 text-white px-4 py-2 rounded-md text-base font-bold hover:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-blue-700"
            aria-label="دخول"
          >
            <LogInIcon className="size-5" />
          </button>
          <input
            id="user-id-input"
            type="text"
            value={userId}
            onChange={e => setUserId(e.target.value)}
            placeholder="ادخل رقمك السري او المعرف الخاص بك"
            className="border border-gray-800 rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary-700 w-full bg-white text-gray-900 placeholder-gray-500"
            dir="ltr"
            aria-label="معرف المستخدم"
            autoComplete="off"
          />
        </form>
      </nav>
      {/* Main Content */}
      <main className="flex-1 min-w-0 w-full h-full p-4 md:p-6">{children}</main>
    </div>
  );
} 