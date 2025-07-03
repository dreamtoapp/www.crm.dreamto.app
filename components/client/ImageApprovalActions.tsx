"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, MessageCircle, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ImageApprovalActionsProps {
  imageId: string;
  currentStatus: string;
  clientId: string;
}

export default function ImageApprovalActions({ 
  imageId, 
  currentStatus, 
  clientId 
}: ImageApprovalActionsProps) {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const router = useRouter();

  const handleAction = async (action: 'approve' | 'reject' | 'revision') => {
    if (action === 'revision' && !feedback.trim()) {
      setShowFeedbackForm(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/images/${imageId}/approval`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          feedback: action === 'revision' ? feedback : undefined
        })
      });

      if (response.ok) {
        router.refresh();
        setFeedback('');
        setShowFeedbackForm(false);
      } else {
        console.error('Failed to update approval status');
      }
    } catch (error) {
      console.error('Error updating approval status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusInfo = (status: string) => {
    const statusConfig = {
      PENDING: { 
        label: 'في انتظار المراجعة', 
        color: 'bg-yellow-100 text-yellow-800',
        description: 'يمكنك مراجعة التصميم واتخاذ قرار بالموافقة أو الرفض أو طلب تعديل'
      },
      APPROVED: { 
        label: 'تمت الموافقة', 
        color: 'bg-green-100 text-green-800',
        description: 'تمت الموافقة على هذا التصميم'
      },
      REJECTED: { 
        label: 'مرفوض', 
        color: 'bg-red-100 text-red-800',
        description: 'تم رفض هذا التصميم'
      },
      REVISION_REQUESTED: { 
        label: 'طلب تعديل', 
        color: 'bg-blue-100 text-blue-800',
        description: 'تم طلب تعديل على هذا التصميم'
      }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
  };

  const statusInfo = getStatusInfo(currentStatus);
  const isPending = currentStatus === 'PENDING';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge className={`${statusInfo.color} border-0`}>
            {statusInfo.label}
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {statusInfo.description}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isPending && (
          <>
            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                onClick={() => handleAction('approve')}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                موافقة
              </Button>
              
              <Button
                onClick={() => handleAction('reject')}
                disabled={isSubmitting}
                variant="destructive"
              >
                <XCircle className="w-4 h-4 mr-2" />
                رفض
              </Button>
              
              <Button
                onClick={() => setShowFeedbackForm(true)}
                disabled={isSubmitting}
                variant="outline"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                طلب تعديل
              </Button>
            </div>

            {/* Feedback Form */}
            {showFeedbackForm && (
              <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    ملاحظات التعديل المطلوبة:
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFeedback(e.target.value)}
                    placeholder="اكتب ملاحظاتك حول التعديلات المطلوبة..."
                    rows={4}
                    className="w-full p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAction('revision')}
                    disabled={isSubmitting || !feedback.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    إرسال طلب التعديل
                  </Button>
                  <Button
                    onClick={() => {
                      setShowFeedbackForm(false);
                      setFeedback('');
                    }}
                    variant="outline"
                    disabled={isSubmitting}
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Status History */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">تاريخ الحالة:</h4>
          <div className="text-xs text-muted-foreground">
            تم تحديث الحالة مؤخراً
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 