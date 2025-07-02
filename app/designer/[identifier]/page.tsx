import db from '@/lib/prisma';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UploadIcon, GalleryHorizontalIcon, ImageIcon, CalendarIcon, MessageCircleIcon, UserIcon, InfoIcon, FileIcon, RulerIcon, XCircleIcon } from 'lucide-react';
import { Suspense } from 'react';

export default async function DesignerHomePage({
  params,
  searchParams,
}: {
  params: Promise<{ identifier: string }>;
  searchParams: Promise<{ clientId?: string; designTypeId?: string }>;
}) {
  const { identifier } = await params;
  const { clientId = 'all', designTypeId = 'all' } = await searchParams;

  // Fetch designer by identifier
  const designer = await db.user.findUnique({ where: { identifier } });
  if (!designer) return <div className="p-8 text-center">المصمم غير موجود</div>;

  // Fetch filters
  const [clients, designTypes] = await Promise.all([
    db.user.findMany({ where: { role: 'CLIENT' }, orderBy: { createdAt: 'desc' } }),
    db.designType.findMany({ orderBy: { createdAt: 'desc' } }),
  ]);

  // Build image query
  const where: any = { uploaderId: designer.id };
  if (clientId && clientId !== 'all') where.clientId = clientId;
  if (designTypeId && designTypeId !== 'all') where.designTypeId = designTypeId;

  const images = await db.image.findMany({
    where,
    include: {
      uploader: { select: { id: true, name: true, role: true, identifier: true } },
      comments: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  function buildUrl(clientId: string, designTypeId: string) {
    const params = new URLSearchParams();
    if (clientId && clientId !== 'all') params.set('clientId', clientId);
    if (designTypeId && designTypeId !== 'all') params.set('designTypeId', designTypeId);
    return `/designer/${identifier}${params.toString() ? '?' + params.toString() : ''}`;
  }

  return (
    <div className="min-h-screen p-4 animate-fade-in w-full" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">معرض تصاميمي</h1>
          <p className="text-base text-muted-foreground">هنا تجد جميع تصاميمك المرفوعة مع تفاصيلها</p>
        </div>
        <Link href={`/designer/${identifier}/upload`}>
          <Button variant="default" size="lg" className="gap-2 rtl:flex-row-reverse">
            <UploadIcon className="size-5" />
            رفع تصميم جديد
          </Button>
        </Link>
      </div>
      {/* Filters */}
      <form className="flex flex-wrap gap-4 items-center mb-8" method="get">
        <select
          name="clientId"
          defaultValue={clientId}
          className="min-w-[160px] border rounded-md px-3 py-2 text-sm"
        >
          <option value="all">كل العملاء</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>{client.name || client.identifier}</option>
          ))}
        </select>
        <select
          name="designTypeId"
          defaultValue={designTypeId}
          className="min-w-[160px] border rounded-md px-3 py-2 text-sm"
        >
          <option value="all">كل الأنواع</option>
          {designTypes.map(dt => (
            <option key={dt.id} value={dt.id}>{dt.name}</option>
          ))}
        </select>
        <Button variant="default" size="sm" type="submit" className="gap-1 rtl:flex-row-reverse">تطبيق الفلاتر</Button>
        {(clientId !== 'all' || designTypeId !== 'all') && (
          <Link href={`/designer/${identifier}`}> 
            <Button variant="ghost" size="sm" type="button" className="gap-1 rtl:flex-row-reverse">
              <XCircleIcon className="size-4" />
              مسح الفلاتر
            </Button>
          </Link>
        )}
      </form>
      {/* Content */}
      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground gap-4">
          <GalleryHorizontalIcon className="size-16 text-gray-300 mb-2" />
          <h2 className="text-2xl font-bold">لا توجد تصاميم بعد</h2>
          <p className="text-base">ابدأ برفع أول تصميم لك الآن!</p>
          <Link href={`/designer/${identifier}/upload`}>
            <Button variant="default" size="lg" className="gap-2 rtl:flex-row-reverse">
              <UploadIcon className="size-5" />
              رفع تصميم جديد
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map(img => {
            const typeName = designTypes.find(dt => dt.id === img.designTypeId)?.name || "نوع غير معروف";
            return (
              <Link key={img.id} href={`/designer/${identifier}/image/${img.id}`} className="block">
                <Card className="h-80 flex flex-col shadow-md hover:shadow-lg transition-shadow group overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between gap-2 p-3 pb-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary">{img.clientName || "عميل غير معروف"}</Badge>
                      <Badge>{typeName}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 cursor-pointer" title={img.publicId}><InfoIcon className="size-4" /></span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 relative">
                    <div className="relative w-full h-40 bg-gray-100 rounded-t-xl overflow-hidden flex items-center justify-center cursor-zoom-in">
                      {img.url ? (
                        <img src={img.url} alt={img.publicId} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
                      ) : (
                        <ImageIcon className="size-12 text-gray-300" />
                      )}
                      <span className="absolute bottom-2 left-2 bg-white/80 rounded px-2 py-1 text-xs text-primary-700 shadow">عرض كامل</span>
                    </div>
                    {/* Technical Info in Card */}
                    {(img.format || img.bytes || (img.width && img.height)) && (
                      <div className="flex flex-row items-center gap-4 px-4 py-2 text-xs text-gray-600">
                        {img.format && (
                          <div className="flex items-center gap-1">
                            <FileIcon className="size-4" />
                            <span>{img.format.toUpperCase()}</span>
                          </div>
                        )}
                        {img.bytes && (
                          <div className="flex items-center gap-1">
                            <FileIcon className="size-4" />
                            <span>{(img.bytes / 1024 < 1024 ? (img.bytes / 1024).toFixed(1) + ' KB' : (img.bytes / 1024 / 1024).toFixed(2) + ' MB')}</span>
                          </div>
                        )}
                        {img.width && img.height && (
                          <div className="flex items-center gap-1">
                            <RulerIcon className="size-4" />
                            <span>{img.width}×{img.height}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-row items-center justify-between gap-2 px-4 py-2 bg-white/80 mt-auto">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <UserIcon className="size-4" />
                      {img.uploader?.name || img.uploader?.identifier || "—"}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <CalendarIcon className="size-4" />
                      {img.createdAt ? new Date(img.createdAt).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" }) : "—"}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MessageCircleIcon className="size-4" />
                      {img.comments?.length || 0}
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
} 