"use client";

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

interface RevisionRulesAgreementProps {
  clientId: string;
  onAgreementChange?: (agreed: boolean) => void;
}

export default function RevisionRulesAgreement({ clientId, onAgreementChange }: RevisionRulesAgreementProps) {
  const [rules, setRules] = useState<string[]>([]);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [loadingRules, setLoadingRules] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoadingRules(true);
      try {
        const rulesRes = await fetch('/api/revision-rules');
        const rulesData = await rulesRes.json();
        setRules(rulesData.map((r: any) => r.text));
        const confirmRes = await fetch(`/api/users/${clientId}/revision-rules-confirmed`);
        const confirmData = await confirmRes.json();
        setCheckboxChecked(!!confirmData.revisionRulesConfirmed);
      } catch {
        setRules([]);
        setCheckboxChecked(false);
      } finally {
        setLoadingRules(false);
      }
    }
    fetchData();
  }, [clientId]);

  const handleRulesCheckbox = async (checked: boolean) => {
    setCheckboxChecked(checked);
    setIsSubmitting(true);
    try {
      await fetch(`/api/users/${clientId}/revision-rules-confirmed`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: checked }),
      });
      if (onAgreementChange) onAgreementChange(checked);
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

  return (
    <div className="mb-4 flex flex-col items-center">
      <button
        className="flex items-center gap-2 px-4 py-2 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 font-medium focus:outline-none"
        onClick={() => setRulesOpen((open) => !open)}
        type="button"
      >
        <Info className="w-4 h-4" />
        يجب عليك قراءة والموافقة على قواعد طلب التعديل قبل إرسال الطلب
        {rulesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {rulesOpen && (
        <div className="max-h-64 overflow-y-auto bg-white dark:bg-muted/30 border rounded p-3 w-full max-w-xl my-2">
          {loadingRules ? (
            <div className="text-center text-muted-foreground">جاري التحميل...</div>
          ) : (
            <ol className="list-decimal pr-5 space-y-1">
              {rules.map((rule, idx) => (
                <li key={idx} className="text-sm text-foreground">{rule}</li>
              ))}
            </ol>
          )}
        </div>
      )}
      <div className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          id="rules-confirm-checkbox"
          checked={checkboxChecked}
          onChange={e => handleRulesCheckbox(e.target.checked)}
          disabled={isSubmitting}
        />
        <label htmlFor="rules-confirm-checkbox" className="text-sm cursor-pointer select-none">
          قرأت قواعد طلب التعديل وأوافق عليها.
        </label>
      </div>
    </div>
  );
} 