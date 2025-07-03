"use client";

import { useState, useEffect } from 'react';
import RevisionRulesAgreement from './RevisionRulesAgreement';
import ImageApprovalActions from './ImageApprovalActions';

interface ClientImageActionsSectionProps {
  clientId: string;
  imageId: string;
  currentStatus: string;
  maxRevisionRequests: number;
  revisionRequestCount: number;
}

export default function ClientImageActionsSection({
  clientId,
  imageId,
  currentStatus,
  maxRevisionRequests,
  revisionRequestCount,
}: ClientImageActionsSectionProps) {
  const [rulesAgreed, setRulesAgreed] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAgreement() {
      setLoading(true);
      try {
        const res = await fetch(`/api/users/${clientId}/revision-rules-confirmed`);
        const data = await res.json();
        setRulesAgreed(!!data.revisionRulesConfirmed);
      } catch {
        setRulesAgreed(false);
      } finally {
        setLoading(false);
      }
    }
    fetchAgreement();
  }, [clientId]);

  if (loading || rulesAgreed === null) {
    return <div className="py-8 text-center text-muted-foreground">جاري تحميل حالة الموافقة على القواعد...</div>;
  }

  return (
    <>
      <RevisionRulesAgreement clientId={clientId} onAgreementChange={setRulesAgreed} />
      <ImageApprovalActions
        imageId={imageId}
        currentStatus={currentStatus}
        clientId={clientId}
        maxRevisionRequests={maxRevisionRequests}
        revisionRequestCount={revisionRequestCount}
        rulesAgreed={rulesAgreed}
      />
    </>
  );
} 