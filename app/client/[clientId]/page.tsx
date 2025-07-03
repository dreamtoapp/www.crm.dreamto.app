import db from '@/lib/prisma';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GalleryHorizontalIcon, ImageIcon, InfoIcon, CheckCircle, XCircle, MessageCircle, Clock } from 'lucide-react';
import DesignerGalleryFilters from '@/components/dashboard/DesignerGalleryFilters';

export default async function ClientGalleryPage({
  params,
  searchParams,
}: {
  params: Promise<{ clientId: string }>;
  searchParams: Promise<{ designTypeId?: string; tag?: string }>;
}) {
  const { clientId } = await params;
  const { designTypeId = 'all', tag = 'all' } = await searchParams;

  // Fetch client info
  const client = await db.user.findUnique({ where: { identifier: clientId, role: 'CLIENT' } });
  if (!client) return <div className="p-8 text-center">العميل غير موجود</div>;

  // Fetch design types
  const designTypes = await db.designType.findMany({ orderBy: { createdAt: 'desc' } });

  // Fetch images for this client
  const where: any = { clientId: client.id };
  if (designTypeId && designTypeId !== 'all') where.designTypeId = designTypeId;
  if (tag && tag !== 'all') where.tag = tag;
  const images = await db.image.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  // Deduplicate images by id
  const uniqueImages = Array.from(new Map(images.map(img => [img.id, img])).values());

  // Unique tags for filter dropdown (only if tag property exists)
  const uniqueTags = Array.from(new Set(uniqueImages.map(img => typeof (img as any).tag === 'string' && (img as any).tag ? (img as any).tag : null).filter((t): t is string => typeof t === 'string' && t.length > 0)));

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { label: 'في انتظار المراجعة', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      APPROVED: { label: 'تمت الموافقة', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      REJECTED: { label: 'مرفوض', color: 'bg-red-100 text-red-800', icon: XCircle },
      REVISION_REQUESTED: { label: 'طلب تعديل', color: 'bg-blue-100 text-blue-800', icon: MessageCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} border-0 text-xs`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen p-6 animate-fade-in" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold heading-elegant mb-3 flex items-center gap-3 justify-center">
            معرض الصور
            <span className="inline-block bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm font-bold align-middle">
              {uniqueImages.length} تصميم
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            استعرض التصاميم المخصصة لك، يمكنك تصفية التصاميم حسب النوع{uniqueTags.length > 0 ? ' أو الوسم' : ''}
          </p>
        </div>
        {/* Filter Section */}
        {/* <DesignerGalleryFilters
          clients={[]}
          designTypes={designTypes}
          selectedClient={''}
          selectedDesignType={designTypeId}
          basePath={`/client/${clientId}`}
        /> */}
        {/* Tag Filter (SSR) */}
        {uniqueTags.length > 0 && (
          <div className="flex flex-wrap gap-4 items-center mb-8">
            <label className="font-medium text-foreground">تصفية حسب الوسم:</label>
            <select
              name="tag"
              value={tag}
              className="min-w-[160px] border rounded-md px-3 py-2 text-sm"
              onChange={e => {
                const params = new URLSearchParams();
                if (designTypeId && designTypeId !== 'all') params.set('designTypeId', designTypeId);
                if (e.target.value !== 'all') params.set('tag', e.target.value);
                window.location.href = `/client/${clientId}${params.toString() ? '?' + params.toString() : ''}`;
              }}
            >
              <option value="all">كل الوسوم</option>
              {uniqueTags.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        )}
        {/* Gallery Grid */}
        {uniqueImages.length === 0 ? (
          <Card className="card-elegant text-center py-16 animate-fade-in">
            <div className="max-w-sm mx-auto flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                <GalleryHorizontalIcon className="size-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-1">لا توجد صور متاحة</h3>
              <p className="text-muted-foreground">لم يتم رفع أي تصاميم لهذا التصنيف بعد. سيتم عرض التصاميم هنا عند توفرها.</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {uniqueImages.map(img => {
              const tagValue = typeof (img as any).tag === 'string' && (img as any).tag.length > 0 ? (img as any).tag : '—';
              return (
                <Link key={img.id} href={`/client/${clientId}/image/${img.id}`} className="block">
                  <Card className="card-interactive gpu-accelerated group transition-transform duration-200 hover:scale-[1.025] hover:shadow-xl rounded-2xl border border-border/60">
                    <div className="image-container aspect-[4/3] relative">
                      {img.url ? (
                        <img
                          src={img.url}
                          alt={tagValue}
                          className="object-cover w-full h-full rounded-t-2xl"
                          style={{ maxHeight: 240 }}
                        />
                      ) : (
                        <ImageIcon className="size-12 text-gray-300 mx-auto my-12" />
                      )}
                      {/* Status Badge Overlay */}
                      <div className="absolute top-2 left-2">
                        {getStatusBadge(img.status || 'PENDING')}
                      </div>
                    </div>
                    <CardHeader className="p-4 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Badge>{tagValue}</Badge>
                        <Badge variant="secondary">{designTypes.find(dt => dt.id === img.designTypeId)?.name || 'نوع غير معروف'}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <InfoIcon className="size-4" />
                        {img.publicId}
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 