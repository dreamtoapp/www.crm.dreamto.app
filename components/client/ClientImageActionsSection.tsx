"use client";

import { useState } from 'react';
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
  const [rulesAgreed, setRulesAgreed] = useState(false);

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