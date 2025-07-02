"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon, PencilIcon, Trash2Icon, EyeIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface Designer {
  id: string;
  key: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function AdminDesignersPage() {
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", key: "" });
  const [submitting, setSubmitting] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ id: "", name: "", email: "", key: "" });
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch designers from API
  useEffect(() => {
    async function fetchDesigners() {
      setLoading(true);
      const res = await fetch("/api/users?role=DESIGNER");
      const data = await res.json();
      setDesigners(data);
      setLoading(false);
    }
    fetchDesigners();
  }, []);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function handleEditInput(e: React.ChangeEvent<HTMLInputElement>) {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  }
  async function handleAddDesigner(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        identifier: form.key,
        role: "DESIGNER",
      }),
    });
    if (res.ok) {
      const newDesigner = await res.json();
      setDesigners((prev) => [
        {
          id: newDesigner.id,
          key: newDesigner.identifier,
          name: newDesigner.name,
          email: newDesigner.email || "",
          createdAt: newDesigner.createdAt?.slice(0, 10) || "",
        },
        ...prev,
      ]);
      setForm({ name: "", email: "", key: "" });
      setOpen(false);
    } else {
      const err = await res.json();
      setError(err.error || "فشل إضافة المصمم");
    }
    setSubmitting(false);
  }
  async function handleEditDesigner(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch(`/api/users/${editForm.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editForm.name,
        email: editForm.email,
      }),
    });
    if (res.ok) {
      setDesigners(designers.map((d) => d.id === editForm.id ? { ...d, name: editForm.name, email: editForm.email } : d));
      setEditOpen(false);
    } else {
      const err = await res.json();
      setError(err.error || "فشل تعديل المصمم");
    }
    setSubmitting(false);
  }
  async function handleDeleteDesigner() {
    if (!deleteId) return;
    setSubmitting(true);
    setError(null);
    const res = await fetch(`/api/users/${deleteId}`, { method: "DELETE" });
    if (res.ok) {
      setDesigners(designers.filter((d) => d.key !== deleteId));
      setDeleteOpen(false);
      setDeleteId(null);
    } else {
      const err = await res.json();
      setError(err.error || "فشل حذف المصمم");
    }
    setSubmitting(false);
  }
  function openEditModal(designer: Designer) {
    setEditForm({ id: designer.id, name: designer.name, email: designer.email, key: designer.key });
    setEditOpen(true);
  }
  function openDeleteModal(key: string) {
    setDeleteId(key);
    setDeleteOpen(true);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">إدارة المصممين</h2>
        <Button className="btn-primary flex items-center gap-2" onClick={() => setOpen(true)}>
          <PlusIcon className="size-5" /> إضافة مصمم جديد
        </Button>
      </div>
      <Card className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>المعرف</TableHead>
              <TableHead>الاسم</TableHead>
              <TableHead>البريد الإلكتروني</TableHead>
              <TableHead>تاريخ الإنشاء</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">جاري التحميل...</TableCell>
              </TableRow>
            ) : designers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">لا يوجد مصممين بعد</TableCell>
              </TableRow>
            ) : (
              designers.map((designer) => (
                <TableRow key={designer.id}>
                  <TableCell>{designer.key}</TableCell>
                  <TableCell>{designer.name}</TableCell>
                  <TableCell>{designer.email}</TableCell>
                  <TableCell>{designer.createdAt}</TableCell>
                  <TableCell>
                    <Button size="icon" variant="ghost" onClick={() => router.push(`/designer/${designer.key}`)} title="عرض معرض المصمم">
                      <EyeIcon className="size-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => openEditModal(designer)}><PencilIcon className="size-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => openDeleteModal(designer.key)}><Trash2Icon className="size-4" /></Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
      {/* Add Designer Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة مصمم جديد</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddDesigner} className="space-y-4">
            <div>
              <Label htmlFor="name">الاسم</Label>
              <Input id="name" name="name" value={form.name} onChange={handleInput} required disabled={submitting} />
            </div>
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" name="email" type="email" value={form.email} onChange={handleInput} disabled={submitting} />
            </div>
            <div>
              <Label htmlFor="key">المعرف (رقم/كود فريد)</Label>
              <Input id="key" name="key" value={form.key} onChange={handleInput} required disabled={submitting} />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <DialogFooter>
              <Button type="submit" className="btn-primary" disabled={submitting}>حفظ</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Edit Designer Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل بيانات المصمم</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditDesigner} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">الاسم</Label>
              <Input id="edit-name" name="name" value={editForm.name} onChange={handleEditInput} required disabled={submitting} />
            </div>
            <div>
              <Label htmlFor="edit-email">البريد الإلكتروني</Label>
              <Input id="edit-email" name="email" type="email" value={editForm.email} onChange={handleEditInput} disabled={submitting} />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <DialogFooter>
              <Button type="submit" className="btn-primary" disabled={submitting}>حفظ التعديلات</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Delete Designer Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد حذف المصمم</DialogTitle>
          </DialogHeader>
          <div className="py-4">هل أنت متأكد أنك تريد حذف هذا المصمم؟ لا يمكن التراجع عن هذا الإجراء.</div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <DialogFooter>
            <Button variant="destructive" onClick={handleDeleteDesigner} disabled={submitting}>حذف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 