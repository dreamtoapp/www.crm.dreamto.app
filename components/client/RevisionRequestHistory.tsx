"use client";

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface RevisionRequest {
  id: string;
  feedback: string;
  status: string;
  createdAt: string;
  doneAt?: string;
  designerId: string;
}

interface RevisionRequestHistoryProps {
  imageId: string;
  designerId: string;
  currentUserId: string;
}

export default function RevisionRequestHistory({ imageId, designerId, currentUserId }: RevisionRequestHistoryProps) {
  const [requests, setRequests] = useState<RevisionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRequests() {
      setLoading(true);
      try {
        const res = await fetch(`/api/revision-requests?imageId=${imageId}`);
        const data = await res.json();
        setRequests(data);
      } catch {
        setRequests([]);
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, [imageId]);

  const handleMarkDone = async (id: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/revision-requests/${id}`, { method: 'PUT' });
      if (res.ok) {
        toast.success('تم تأكيد تنفيذ الطلب.');
        setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status: 'DONE', doneAt: new Date().toISOString() } : r));
      } else {
        toast.error('حدث خطأ أثناء تحديث الطلب.');
      }
    } catch {
      toast.error('حدث خطأ أثناء تحديث الطلب.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div className="text-center text-muted-foreground">جاري التحميل...</div>;
  if (!requests.length) return null;

  return (
    <div className="space-y-4">
      {requests.map(req => (
        <div key={req.id} className="p-3 border rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={req.status === 'DONE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
              {req.status === 'DONE' ? 'تم التنفيذ' : 'قيد التنفيذ'}
            </Badge>
            <span className="text-xs text-muted-foreground">{new Date(req.createdAt).toLocaleString('ar-EG')}</span>
            {req.status === 'DONE' && req.doneAt && (
              <span className="text-xs text-green-700 ml-2">تم التأكيد: {new Date(req.doneAt).toLocaleString('ar-EG')}</span>
            )}
          </div>
          <div className="mb-2">
            <span className="font-medium text-blue-800">ملاحظات التعديل:</span>
            <span className="ml-2 text-foreground">{req.feedback}</span>
          </div>
          {req.status === 'PENDING' && currentUserId === designerId && (
            <Button
              size="sm"
              onClick={() => handleMarkDone(req.id)}
              disabled={updatingId === req.id}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              تأكيد التنفيذ
            </Button>
          )}
        </div>
      ))}
    </div>
  );
} 