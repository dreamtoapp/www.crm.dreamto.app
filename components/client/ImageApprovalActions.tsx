"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, MessageCircle, Send, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ImageApprovalActionsProps {
  imageId: string;
  currentStatus: string;
  clientId: string;
  maxRevisionRequests: number;
  revisionRequestCount: number;
  rulesAgreed: boolean;
}

export default function ImageApprovalActions({ 
  imageId, 
  currentStatus, 
  clientId,
  maxRevisionRequests,
  revisionRequestCount,
  rulesAgreed
}: ImageApprovalActionsProps) {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rulesConfirmed, setRulesConfirmed] = useState<boolean | null>(null);
  const [rules, setRules] = useState<string[]>([]);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [loadingRules, setLoadingRules] = useState(false);
  const router = useRouter();

  // Fetch confirmation status on mount
  useEffect(() => {
    async function fetchConfirmed() {
      try {
        const res = await fetch(`/api/users/${clientId}/revision-rules-confirmed`);
        const data = await res.json();
        setRulesConfirmed(data.revisionRulesConfirmed);
      } catch {
        setRulesConfirmed(false);
      }
    }
    fetchConfirmed();
  }, [clientId]);

  // Always fetch rules on mount
  useEffect(() => {
    setLoadingRules(true);
    fetch('/api/revision-rules')
      .then(res => res.json())
      .then(data => setRules(data.map((r: any) => r.text)))
      .finally(() => setLoadingRules(false));
  }, []);

  // Handle checkbox toggle and update backend
  const handleRulesCheckbox = async (checked: boolean) => {
    setCheckboxChecked(checked);
    setIsSubmitting(true);
    try {
      await fetch(`/api/users/${clientId}/revision-rules-confirmed`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: checked }),
      });
      setRulesConfirmed(checked);
      if (checked) {
        toast.success('تم تأكيد الموافقة على القواعد. يمكنك الآن إرسال طلب التعديل.');
      } else {
        toast.info('تم إلغاء الموافقة على القواعد.');
      }
    } catch {
      toast.error('حدث خطأ أثناء تحديث الموافقة على القواعد.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAction = async (action: 'approve' | 'reject' | 'revision', reason?: string) => {
    if (action === 'revision' && !feedback.trim()) {
      setShowFeedbackForm(true);
      return;
    }
    if (action === 'reject' && (!reason || !reason.trim())) {
      setShowRejectDialog(true);
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/images/${imageId}/approval`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          feedback: action === 'revision' ? feedback : action === 'reject' ? reason : undefined
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

  const handleApprove = async () => {
    setShowApproveDialog(false);
    await handleAction('approve');
    toast.success('تمت الموافقة على التصميم بنجاح.');
  };

  const handleReject = async () => {
    setShowRejectDialog(false);
    await handleAction('reject', rejectReason);
    setRejectReason('');
    toast.success('تم رفض التصميم مع ذكر السبب.');
  };

  const getStatusInfo = (status: string) => {
    const statusConfig = {
      PENDING: { 
        label: 'في انتظار المراجعة', 
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
        description: 'يمكنك مراجعة التصميم واتخاذ قرار بالموافقة أو الرفض أو طلب تعديل'
      },
      APPROVED: { 
        label: 'تمت الموافقة', 
        color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
        description: 'تمت الموافقة على هذا التصميم'
      },
      REJECTED: { 
        label: 'مرفوض', 
        color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
        description: 'تم رفض هذا التصميم'
      },
      REVISION_REQUESTED: { 
        label: 'طلب تعديل', 
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
        description: 'تم طلب تعديل على هذا التصميم'
      }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
  };

  const statusInfo = getStatusInfo(currentStatus);
  const isPending = currentStatus === 'PENDING';
  const reachedLimit = revisionRequestCount >= maxRevisionRequests;
  const canSendRevision = !isSubmitting && feedback.trim() && (!reachedLimit) && rulesAgreed;

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
                onClick={() => setShowApproveDialog(true)}
                disabled={isSubmitting}
                className="bg-success hover:bg-success/90 text-success-foreground"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                موافقة
              </Button>
              
              <Button
                onClick={() => setShowRejectDialog(true)}
                disabled={isSubmitting}
                variant="destructive"
              >
                <XCircle className="w-4 h-4 mr-2" />
                رفض
              </Button>
              
              <Button
                onClick={() => setShowFeedbackForm(true)}
                disabled={isSubmitting || reachedLimit}
                variant="outline"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                طلب تعديل
              </Button>
            </div>
            {reachedLimit && (
              <div className="text-xs text-destructive mt-2 text-center">لا يمكنك طلب تعديل آخر، لقد وصلت للحد الأقصى.</div>
            )}

            {/* Feedback Form */}
            {showFeedbackForm && (
              <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
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
                    disabled={!canSendRevision}
                    className="bg-primary hover:bg-primary/90"
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

            {/* Approve Confirmation Dialog */}
            <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
              <DialogContent showCloseButton={false}>
                <DialogHeader>
                  <DialogTitle>تأكيد الموافقة</DialogTitle>
                  <DialogDescription>
                    بمجرد الموافقة، سيبدأ فريق العمل في تنفيذ هذا التصميم. هل أنت متأكد أنك تريد الموافقة؟
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button onClick={handleApprove} disabled={isSubmitting} className="bg-success hover:bg-success/90 text-success-foreground">
                    تأكيد
                  </Button>
                  <DialogClose asChild>
                    <Button variant="outline">إلغاء</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Reject Confirmation Dialog */}
            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
              <DialogContent showCloseButton={false}>
                <DialogHeader>
                  <DialogTitle>تأكيد الرفض</DialogTitle>
                  <DialogDescription>
                    يجب عليك ذكر سبب الرفض لهذا التصميم.
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <textarea
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    placeholder="اكتب سبب الرفض..."
                    rows={4}
                    className="w-full p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <DialogFooter>
                  <Button onClick={handleReject} disabled={isSubmitting || !rejectReason.trim()} variant="destructive">
                    إرسال الرفض
                  </Button>
                  <DialogClose asChild>
                    <Button variant="outline">إلغاء</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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