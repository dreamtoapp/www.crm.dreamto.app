"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ClientIdInputPage() {
  const [clientId, setClientId] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId.trim()) {
      setError("يرجى إدخال رقم العميل");
      return;
    }
    setError("");
    router.push(`/client/${clientId}`);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <Card className="w-full max-w-sm p-6 flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-2 text-right">أدخل رقم العميل الخاص بك</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="client-id" className="text-right">رقم العميل</Label>
            <Input
              id="client-id"
              type="text"
              placeholder="مثال: 12345"
              autoComplete="off"
              value={clientId}
              onChange={e => setClientId(e.target.value)}
              className="text-right"
            />
            {error && <span className="text-red-500 text-xs text-right">{error}</span>}
          </div>
          <Button type="submit" className="w-full">دخول المعرض</Button>
        </form>
      </Card>
    </div>
  );
} 