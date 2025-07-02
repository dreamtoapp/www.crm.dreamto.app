"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon, PencilIcon, Trash2Icon } from "lucide-react";

interface DesignType {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export default function AdminDesignTypesPage() {
  const [designTypes, setDesignTypes] = useState<DesignType[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ id: "", name: "", description: "" });
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch design types from API
  useEffect(() => {
    async function fetchTypes() {
      setLoading(true);
      const res = await fetch("/api/design-types");
      const data = await res.json();
      setDesignTypes(data);
      setLoading(false);
    }
    fetchTypes();
  }, []);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function handleEditInput(e: React.ChangeEvent<HTMLInputElement>) {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  }
  async function handleAddType(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/design-types", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, description: form.description }),
    });
    if (res.ok) {
      const newType = await res.json();
      setDesignTypes((prev) => [newType, ...prev]);
      setForm({ name: "", description: "" });
      setOpen(false);
    } else {
      const err = await res.json();
      setError(err.error || "فشل إضافة النوع");
    }
    setSubmitting(false);
  }
  async function handleEditType(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch(`/api/design-types/${editForm.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editForm.name, description: editForm.description }),
    });
    if (res.ok) {
      const updated = await res.json();
      setDesignTypes(designTypes.map((t) => t.id === editForm.id ? updated : t));
      setEditOpen(false);
    } else {
      const err = await res.json();
      setError(err.error || "فشل تعديل النوع");
    }
    setSubmitting(false);
  }
  async function handleDeleteType() {
    if (!deleteId) return;
    setSubmitting(true);
    setError(null);
    const res = await fetch(`/api/design-types/${deleteId}`, { method: "DELETE" });
    if (res.ok) {
      setDesignTypes(designTypes.filter((t) => t.id !== deleteId));
      setDeleteOpen(false);
      setDeleteId(null);
    } else {
      const err = await res.json();
      setError(err.error || "فشل حذف النوع");
    }
    setSubmitting(false);
  }
  function openEditModal(type: DesignType) {
    setEditForm({ id: type.id, name: type.name, description: type.description || "" });
    setEditOpen(true);
  }
  function openDeleteModal(id: string) {
    setDeleteId(id);
    setDeleteOpen(true);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">إدارة أنواع التصاميم</h2>
        <Button className="btn-primary flex items-center gap-2" onClick={() => setOpen(true)}>
          <PlusIcon className="size-5" /> إضافة نوع جديد
        </Button>
      </div>
      <Card className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>النوع</TableHead>
              <TableHead>الوصف</TableHead>
              <TableHead>تاريخ الإنشاء</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">جاري التحميل...</TableCell>
              </TableRow>
            ) : designTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">لا يوجد أنواع تصاميم بعد</TableCell>
              </TableRow>
            ) : (
              designTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell>{type.name}</TableCell>
                  <TableCell>{type.description}</TableCell>
                  <TableCell>{type.createdAt?.slice(0, 10)}</TableCell>
                  <TableCell>
                    <Button size="icon" variant="ghost" onClick={() => openEditModal(type)}><PencilIcon className="size-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => openDeleteModal(type.id)}><Trash2Icon className="size-4" /></Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
      {/* Add Type Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة نوع جديد</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddType} className="space-y-4">
            <div>
              <Label htmlFor="name">النوع</Label>
              <Input id="name" name="name" value={form.name} onChange={handleInput} required disabled={submitting} />
            </div>
            <div>
              <Label htmlFor="description">الوصف</Label>
              <Input id="description" name="description" value={form.description} onChange={handleInput} disabled={submitting} />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <DialogFooter>
              <Button type="submit" className="btn-primary" disabled={submitting}>حفظ</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Edit Type Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل النوع</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditType} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">النوع</Label>
              <Input id="edit-name" name="name" value={editForm.name} onChange={handleEditInput} required disabled={submitting} />
            </div>
            <div>
              <Label htmlFor="edit-description">الوصف</Label>
              <Input id="edit-description" name="description" value={editForm.description} onChange={handleEditInput} disabled={submitting} />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <DialogFooter>
              <Button type="submit" className="btn-primary" disabled={submitting}>حفظ التعديلات</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Delete Type Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد حذف النوع</DialogTitle>
          </DialogHeader>
          <div className="py-4">هل أنت متأكد أنك تريد حذف هذا النوع؟ لا يمكن التراجع عن هذا الإجراء.</div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <DialogFooter>
            <Button variant="destructive" onClick={handleDeleteType} disabled={submitting}>حذف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 