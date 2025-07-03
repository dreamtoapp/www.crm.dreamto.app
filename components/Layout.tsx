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
import { UserIcon, UsersIcon, ImageIcon, UploadIcon, GalleryHorizontalIcon, SparklesIcon, LogInIcon, MenuIcon, GlobeIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { toast } from 'sonner';
import Image from "next/image";
import { ModeToggle } from "./ui/mode-toggle";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [userId, setUserId] = React.useState("");
  const [user, setUser] = React.useState<{ role: string; name: string; identifier: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    try {
      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) throw new Error("المستخدم غير موجود أو حدث خطأ في البحث.");
      const user = await res.json();
      if (!user || !user.role) throw new Error("تعذر تحديد نوع المستخدم.");
      setUser(user);
      setUserId("");
      if (user.role === "CLIENT") {
        router.push(`/client/${user.identifier}`);
      } else if (user.role === "DESIGNER") {
        router.push(`/designer/${user.identifier}`);
      } else if (user.role === "ADMIN") {
        router.push(`/admin`);
      } else {
        toast.error("نوع مستخدم غير معروف. الرجاء التواصل مع الإدارة.");
      }
    } catch (err: any) {
      toast.error(err.message || "حدث خطأ أثناء تسجيل الدخول.");
    }
  }

  const navLinks = user?.role === "ADMIN"
    ? [
        { href: "/admin/clients", label: "العملاء" },
        { href: "/admin/designers", label: "المصممون" },
        { href: "/admin/design-types", label: "أنواع التصاميم" },
        { href: "/admin/images", label: "الصور" },
      ]
    : user?.role === "DESIGNER"
    ? [
        { href: "/designer/upload", label: "رفع تصميم" },
        { href: `/designer/${user.identifier}`, label: "تصاميمي" },
        { href: "/designer/gallery", label: "المعرض" },
      ]
    : user?.role === "CLIENT"
    ? [
        { href: `/client/${user.identifier}`, label: "معرضي" },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <nav dir="rtl" className="w-full flex items-center justify-between px-4 md:px-8 py-3 border-b bg-background shadow-sm sticky top-0 z-30">
        {/* Branding/Logo and Title */}
        <div className="flex items-center gap-3">
          <button className="md:hidden p-2" aria-label="فتح القائمة" onClick={() => setMobileMenuOpen(v => !v)}>
            <MenuIcon className="size-6" />
          </button>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow bg-white border border-border">
            <Link href="/">
              <Image src="/dta.svg" alt="شعار النظام" width={40} height={40} className="object-contain cursor-pointer" />
            </Link>
          </div>
          <div className="text-right hidden sm:block">
            <h1 className="text-2xl font-extrabold leading-tight text-foreground tracking-tight">مرحباً بك في <span className="text-primary">نظام معرض العملاء</span></h1>
            <p className="text-sm text-muted-foreground font-medium mt-1">منصة احترافية لإدارة التصاميم والمراجعة بسهولة وود</p>
          </div>
        </div>
        {/* Nav Links (desktop) */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="text-base font-medium text-muted-foreground hover:text-primary transition" aria-label={link.label}>{link.label}</Link>
          ))}
        </div>
        {/* Actions: Language switcher, user info, login */}
        <div className="flex items-center gap-2">
          {/* Language Switcher Placeholder */}
          <button className="p-2 rounded hover:bg-accent" aria-label="تغيير اللغة">
            <GlobeIcon className="size-5" />
          </button>
          {/* Theme Toggle */}
          <ModeToggle />
          {/* User Info or Login */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-primary">{user.name || user.identifier}</span>
              <span className="text-xs text-muted-foreground">{user.role}</span>
              {/* Logout */}
              <button onClick={() => { setUser(null); router.push("/"); }} className="text-xs text-destructive hover:underline ml-2" aria-label="تسجيل الخروج">خروج</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full max-w-xs md:max-w-sm justify-end">
              <button
                type="submit"
                className="flex items-center justify-center gap-1 bg-primary text-primary-foreground px-4 py-2 rounded-md text-base font-bold hover:bg-primary/90 transition focus:outline-none focus:ring-2 focus:ring-ring"
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
                className="border border-input rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ring w-full bg-background text-foreground placeholder-muted-foreground"
                dir="ltr"
                aria-label="معرف المستخدم"
                autoComplete="off"
              />
            </form>
          )}
        </div>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
        )}
        <div className={`fixed top-0 right-0 z-50 w-64 h-full bg-background shadow-lg transition-transform duration-300 md:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} dir="rtl">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white shadow">
                <Image src="/dta.svg" alt="شعار النظام" width={32} height={32} className="object-contain" />
              </div>
              <span className="font-bold text-lg">المعرض</span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} aria-label="إغلاق القائمة" className="p-2">
              <MenuIcon className="size-6" />
            </button>
          </div>
          <div className="flex flex-col gap-4 p-4">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="text-base font-medium text-muted-foreground hover:text-primary transition" aria-label={link.label} onClick={() => setMobileMenuOpen(false)}>{link.label}</Link>
            ))}
            {/* Language Switcher Placeholder */}
            <button className="p-2 rounded hover:bg-accent w-fit" aria-label="تغيير اللغة">
              <GlobeIcon className="size-5" /> تغيير اللغة
            </button>
            {/* Theme Toggle */}
            <ModeToggle />
            {user && (
              <div className="flex flex-col gap-1 mt-4">
                <span className="text-sm font-bold text-primary">{user.name || user.identifier}</span>
                <span className="text-xs text-muted-foreground">{user.role}</span>
                <button onClick={() => { setUser(null); router.push("/"); }} className="text-xs text-destructive hover:underline w-fit" aria-label="تسجيل الخروج">خروج</button>
              </div>
            )}
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <main className="flex-1 min-w-0 w-full h-full p-4 md:p-6">{children}</main>
    </div>
  );
} 