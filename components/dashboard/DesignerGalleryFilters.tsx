"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { XCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  clients: { id: string; name?: string; identifier?: string }[];
  designTypes: { id: string; name: string }[];
  selectedClient: string;
  selectedDesignType: string;
  basePath: string;
};

export default function DesignerGalleryFilters({
  clients,
  designTypes,
  selectedClient,
  selectedDesignType,
  basePath,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(param: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') {
      params.delete(param);
    } else {
      params.set(param, value);
    }
    router.replace(`${basePath}${params.toString() ? '?' + params.toString() : ''}`);
  }

  function clearFilters() {
    router.replace(basePath);
  }

  return (
    <div className="flex flex-wrap gap-4 items-center mb-8">
      <select
        name="clientId"
        value={selectedClient}
        className="min-w-[160px] border rounded-md px-3 py-2 text-sm"
        onChange={e => updateParam('clientId', e.target.value)}
      >
        <option value="all">كل العملاء</option>
        {clients.map(client => (
          <option key={client.id} value={client.id}>
            {client.name || client.identifier}
          </option>
        ))}
      </select>
      <select
        name="designTypeId"
        value={selectedDesignType}
        className="min-w-[160px] border rounded-md px-3 py-2 text-sm"
        onChange={e => updateParam('designTypeId', e.target.value)}
      >
        <option value="all">كل الأنواع</option>
        {designTypes.map(dt => (
          <option key={dt.id} value={dt.id}>
            {dt.name}
          </option>
        ))}
      </select>
      {(selectedClient !== 'all' || selectedDesignType !== 'all') && (
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={clearFilters}
          className="gap-1 rtl:flex-row-reverse"
        >
          <XCircleIcon className="size-4" />
          مسح الفلاتر
        </Button>
      )}
    </div>
  );
} 