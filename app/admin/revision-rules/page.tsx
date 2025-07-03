"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Rule {
  id: string;
  text: string;
  order: number;
}

export default function RevisionRulesAdminPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newRule, setNewRule] = useState("");
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [maxRevision, setMaxRevision] = useState<string>("");
  const [maxRevisionLoading, setMaxRevisionLoading] = useState(true);
  const [maxRevisionError, setMaxRevisionError] = useState<string | null>(null);
  const [maxRevisionSaving, setMaxRevisionSaving] = useState(false);

  // Fetch rules
  useEffect(() => {
    fetchRules();
  }, []);

  // Fetch max revision requests value
  useEffect(() => {
    async function fetchMaxRevision() {
      setMaxRevisionLoading(true);
      setMaxRevisionError(null);
      try {
        const res = await fetch("/api/settings/max-revision-requests");
        const data = await res.json();
        setMaxRevision(data.value ?? "");
      } catch {
        setMaxRevisionError("تعذر جلب الحد الأقصى لطلبات التعديل.");
      } finally {
        setMaxRevisionLoading(false);
      }
    }
    fetchMaxRevision();
  }, []);

  async function fetchRules() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/revision-rules");
      const data = await res.json();
      setRules(data);
    } catch (e) {
      setError("حدث خطأ أثناء جلب القواعد.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddRule() {
    if (!newRule.trim()) return;
    setAdding(true);
    try {
      const res = await fetch("/api/revision-rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newRule, order: rules.length + 1 }),
      });
      if (!res.ok) throw new Error();
      setNewRule("");
      // Fetch updated rules
      const updatedRes = await fetch("/api/revision-rules");
      const updatedRules: Rule[] = await updatedRes.json();
      // Reorder all rules
      for (let i = 0; i < updatedRules.length; i++) {
        await fetch(`/api/revision-rules/${updatedRules[i].id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: updatedRules[i].text, order: i + 1 }),
        });
      }
      fetchRules();
    } catch {
      setError("تعذر إضافة القاعدة.");
    } finally {
      setAdding(false);
    }
  }

  async function handleEditRule() {
    if (!editId || !editText.trim()) return;
    try {
      const res = await fetch(`/api/revision-rules/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editText }),
      });
      if (!res.ok) throw new Error();
      setEditId(null);
      setEditText("");
      // Fetch updated rules
      const updatedRes = await fetch("/api/revision-rules");
      const updatedRules: Rule[] = await updatedRes.json();
      // Reorder all rules
      for (let i = 0; i < updatedRules.length; i++) {
        await fetch(`/api/revision-rules/${updatedRules[i].id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: updatedRules[i].text, order: i + 1 }),
        });
      }
      fetchRules();
    } catch {
      setError("تعذر تعديل القاعدة.");
    }
  }

  async function handleDeleteRule() {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/revision-rules/${deletingId}`, {
        method: "DELETE" });
      if (!res.ok) throw new Error();
      setDeletingId(null);
      // Fetch updated rules
      const updatedRes = await fetch("/api/revision-rules");
      const updatedRules: Rule[] = await updatedRes.json();
      // Reorder all rules
      for (let i = 0; i < updatedRules.length; i++) {
        await fetch(`/api/revision-rules/${updatedRules[i].id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: updatedRules[i].text, order: i + 1 }),
        });
      }
      fetchRules();
    } catch {
      setError("تعذر حذف القاعدة.");
    }
  }

  async function handleSaveMaxRevision() {
    setMaxRevisionSaving(true);
    setMaxRevisionError(null);
    try {
      const res = await fetch("/api/settings/max-revision-requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: maxRevision }),
      });
      if (!res.ok) throw new Error();
      toast.success("تم تحديث الحد الأقصى بنجاح.");
    } catch {
      setMaxRevisionError("تعذر حفظ القيمة.");
    } finally {
      setMaxRevisionSaving(false);
    }
  }

  return (
    <div className="min-h-screen p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-start mb-4">
          <Link href="/admin">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowRight className="size-4" />
              رجوع
            </Button>
          </Link>
        </div>
        <h1 className="text-4xl font-bold mb-8 text-center">لوحة تحكم الإدارة</h1>
        {/* Max revision requests setting */}
        <div className="mb-8 flex flex-col items-center gap-2 bg-muted p-4 rounded-lg border border-border">
          <label className="font-semibold text-lg mb-1">الحد الأقصى لعدد طلبات التعديل لكل تصميم</label>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              min={1}
              className="w-24 text-center"
              value={maxRevision}
              onChange={e => setMaxRevision(e.target.value)}
              disabled={maxRevisionLoading || maxRevisionSaving}
            />
            <Button
              onClick={handleSaveMaxRevision}
              disabled={maxRevisionLoading || maxRevisionSaving || !maxRevision}
              variant="default"
            >
              حفظ
            </Button>
          </div>
          {maxRevisionLoading && <span className="text-sm text-muted-foreground">جاري التحميل...</span>}
          {maxRevisionError && <span className="text-sm text-destructive">{maxRevisionError}</span>}
        </div>
        <Card className="p-6 mb-6">
          <div className="flex gap-2 items-center">
            <Input
              value={newRule}
              onChange={e => setNewRule(e.target.value)}
              placeholder="أضف قاعدة جديدة..."
              className="flex-1"
            />
            <Button onClick={handleAddRule} disabled={adding || !newRule.trim()}>
              إضافة
            </Button>
          </div>
        </Card>
        {loading ? (
          <div className="text-center py-8">جاري التحميل...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : (
          <Card className="p-4">
            {rules.length === 0 ? (
              <div className="text-center text-muted-foreground">لا توجد قواعد بعد.</div>
            ) : (
              <ul className="space-y-4">
                {rules.map((rule, idx) => (
                  <li key={rule.id} className="flex items-center gap-2 border-b pb-2 last:border-b-0 last:pb-0">
                    <span className="text-muted-foreground w-6 text-center">{idx + 1}</span>
                    {editId === rule.id ? (
                      <>
                        <Input
                          value={editText}
                          onChange={e => setEditText(e.target.value)}
                          className="flex-1"
                        />
                        <Button size="sm" onClick={handleEditRule} disabled={!editText.trim()}>
                          حفظ
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditId(null)}>
                          إلغاء
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1">{rule.text}</span>
                        <Button size="sm" variant="outline" onClick={() => { setEditId(rule.id); setEditText(rule.text); }}>
                          تعديل
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => setDeletingId(rule.id)}>
                          حذف
                        </Button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}
        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deletingId} onOpenChange={open => !open && setDeletingId(null)}>
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>تأكيد الحذف</DialogTitle>
            </DialogHeader>
            <div>هل أنت متأكد أنك تريد حذف هذه القاعدة؟ لا يمكن التراجع عن هذا الإجراء.</div>
            <DialogFooter>
              <Button variant="destructive" onClick={handleDeleteRule}>حذف</Button>
              <DialogClose asChild>
                <Button variant="outline">إلغاء</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 