"use client";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface Option {
  id: string;
  name: string;
}

interface FilterBarProps {
  typeOptions: Option[];
  clientOptions: Option[];
}

export default function FilterBar({ typeOptions, clientOptions }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedType = searchParams.get("type") || "";
  const selectedClient = searchParams.get("client") || "";
  
  // Local state for filter options
  const [localTypeOptions, setLocalTypeOptions] = useState<Option[]>([]);
  const [localClientOptions, setLocalClientOptions] = useState<Option[]>([]);
  
  // useEffect to update local state when props change
  useEffect(() => {
    if (typeOptions && typeOptions.length > 0) {
      setLocalTypeOptions(typeOptions);
    }
  }, [typeOptions]);
  
  useEffect(() => {
    if (clientOptions && clientOptions.length > 0) {
      setLocalClientOptions(clientOptions);
    }
  }, [clientOptions]);

  const handleTypeChange = (value: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (value && value !== "all") params.set("type", value);
    else params.delete("type");
    router.replace(`?${params.toString()}`);
  };

  const handleClientChange = (value: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (value && value !== "all") params.set("client", value);
    else params.delete("client");
    router.replace(`?${params.toString()}`);
  };

  const handleClearFilters = () => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.delete("type");
    params.delete("client");
    router.replace(`?${params.toString()}`);
  };

  // Defensive: show skeleton if options are not loaded yet
  if (!localTypeOptions?.length || !localClientOptions?.length) {
    return (
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="w-40 h-10 bg-gray-100 animate-pulse rounded" />
        <div className="w-40 h-10 bg-gray-100 animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <Select value={selectedType} onValueChange={handleTypeChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="كل الأنواع" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">كل الأنواع</SelectItem>
          {localTypeOptions
            .filter(type => typeof type.id === "string" && !!type.id.trim())
            .map((type: Option) =>
              type.id && type.id !== "" ? (
                <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
              ) : null
            )}
        </SelectContent>
      </Select>
      <Select value={selectedClient} onValueChange={handleClientChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="كل العملاء" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">كل العملاء</SelectItem>
          {localClientOptions
            .filter(client => typeof client.id === "string" && !!client.id.trim())
            .map((client: Option) =>
              client.id && client.id !== "" ? (
                <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
              ) : null
            )}
        </SelectContent>
      </Select>
      {(selectedType || selectedClient) && (
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200"
        >
          مسح الفلاتر
        </button>
      )}
    </div>
  );
} 