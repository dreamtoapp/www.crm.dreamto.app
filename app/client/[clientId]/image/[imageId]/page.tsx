import db from '@/lib/prisma';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, XCircle, MessageCircle, Clock, Info, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import ImageApprovalActions from '@/components/client/ImageApprovalActions';
import ImageComments from '@/components/client/ImageComments';
import RevisionRulesAgreement from '@/components/client/RevisionRulesAgreement';

export default async function ClientImageDetailPage({
  params,
}: {
  params: Promise<{ clientId: string; imageId: string }>;
}) {
  const { clientId, imageId } = await params;

  // Fetch client info
  const client = await db.user.findUnique({ 
    where: { identifier: clientId, role: 'CLIENT' } 
  });
  if (!client) return <div className="p-8 text-center">العميل غير موجود</div>;

  // Fetch image with related data
  const image = await db.image.findFirst({
    where: { 
      id: imageId, 
      clientId: client.id 
    },
    include: {
      uploader: { select: { name: true, identifier: true } },
      designType: { select: { name: true } },
      comments: {
        include: {
          author: { select: { name: true, role: true } }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!image) return <div className="p-8 text-center">الصورة غير موجودة</div>;

  // Convert comments to match the expected interface
  const formattedComments = image.comments.map(comment => ({
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt.toISOString(),
    author: {
      name: comment.author.name,
      role: comment.author.role
    }
  }));

  // Fetch max revision requests from settings API
  let maxRevisionRequests = 2;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/settings/max-revision-requests`, { cache: 'no-store' });
    const data = await res.json();
    if (data.value) maxRevisionRequests = Number(data.value);
  } catch {}

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
      <Badge className={`${config.color} border-0`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen p-6 animate-fade-in" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href={`/client/${clientId}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة إلى المعرض
          </Link>
        </div>

        {/* Revision Rules Agreement Section (Client Component) */}
        <RevisionRulesAgreement clientId={clientId} />
        {/* Revision Counter Message */}
        {maxRevisionRequests > 0 && (
          <div className="mb-2 flex items-center justify-center">
            {image.revisionRequestCount >= maxRevisionRequests ? (
              <Badge className="bg-destructive/10 text-destructive flex items-center gap-2 px-4 py-2 text-base">
                <AlertTriangle className="w-4 h-4" />
                {`لقد استخدمت ${image.revisionRequestCount} من أصل ${maxRevisionRequests} طلب تعديل مسموح لهذا التصميم.`}
              </Badge>
            ) : (
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 flex items-center gap-2 px-4 py-2 text-base">
                <Info className="w-4 h-4" />
                {`لقد استخدمت ${image.revisionRequestCount} من أصل ${maxRevisionRequests} طلب تعديل مسموح لهذا التصميم.`}
              </Badge>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div>
            <Card className="overflow-hidden">
              <div className="aspect-[4/3] relative bg-gray-100">
                {image.url ? (
                  <img
                    src={image.url}
                    alt="Design"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <span>لا توجد صورة</span>
                  </div>
                )}
              </div>
              <CardHeader className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {image.designType?.name || 'نوع غير معروف'}
                    </Badge>
                    {getStatusBadge(image.status || 'PENDING')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(image.createdAt).toLocaleDateString('ar-SA')}
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">المصمم:</span>
                    <span className="font-medium">{image.uploader?.name || image.uploader?.identifier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">معرف الصورة:</span>
                    <span className="font-mono text-xs">{image.publicId}</span>
                  </div>
                  {image.status === 'REJECTED' && image.rejectionReason && (
                    <div className="mt-4 p-3 bg-red-50 rounded-lg">
                      <div className="text-sm font-medium text-red-900 mb-1">سبب الرفض:</div>
                      <div className="text-sm text-red-800">{image.rejectionReason}</div>
                    </div>
                  )}
                  {image.clientFeedback && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm font-medium text-blue-900 mb-1">ملاحظات العميل:</div>
                      <div className="text-sm text-blue-800">{image.clientFeedback}</div>
                    </div>
                  )}
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Actions & Comments Section */}
          <div className="space-y-6">
            <ImageApprovalActions 
              imageId={image.id}
              currentStatus={image.status || 'PENDING'}
              clientId={clientId}
              maxRevisionRequests={maxRevisionRequests}
              revisionRequestCount={image.revisionRequestCount}
            />

            {/* Comments Section */}
            <ImageComments 
              imageId={image.id}
              comments={formattedComments}
              clientId={clientId}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 