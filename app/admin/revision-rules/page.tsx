"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";

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

  // Fetch rules
  useEffect(() => {
    fetchRules();
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

  return (
    <div className="max-w-2xl mx-auto p-6" dir="rtl">
      <h1 className="text-2xl font-bold mb-6 text-center">إدارة قواعد طلب التعديل</h1>
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
  );
} 