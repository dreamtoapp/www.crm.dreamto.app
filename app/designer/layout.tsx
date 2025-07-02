import React from 'react';
import Link from 'next/link';

export default function DesignerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation Bar */}
      <nav className="w-full bg-white border-b border-gray-200 shadow-sm py-4 px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/designer" className="text-xl font-bold text-primary">
            لوحة المصمم
          </Link>
          <Link href="/designer/gallery" className="text-sm text-gray-700 hover:text-primary transition-colors">
            المعرض
          </Link>
          <Link href="/designer/upload" className="text-sm text-gray-700 hover:text-primary transition-colors">
            رفع تصميم
          </Link>
        </div>
        <div className="text-xs text-gray-400">نظام إدارة التصاميم</div>
      </nav>
      {/* Main Content */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
} 