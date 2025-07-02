"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { EyeIcon, PencilIcon, Trash2Icon, PlusIcon, UsersIcon, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";

// Helper to generate a random 8-character alphanumeric client key
function generateClientKey() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", clientKey: "" });
  const [submitting, setSubmitting] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ id: "", name: "", email: "", clientKey: "" });
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();

  // Fetch clients from API on mount
  useEffect(() => {
    async function fetchClients() {
      setLoading(true);
      const res = await fetch("/api/users");
      const data = await res.json();
      setClients(data);
      setLoading(false);
    }
    fetchClients();
  }, []);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function handleEditInput(e: React.ChangeEvent<HTMLInputElement>) {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  }
  async function handleAddClient(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        identifier: form.clientKey,
        role: "CLIENT",
      }),
    });
    if (res.ok) {
      const newClient = await res.json();
      setClients((prev) => [
        {
          id: newClient.id,
          key: newClient.identifier,
          name: newClient.name,
          email: newClient.email || "",
          images: 0,
          createdAt: new Date(newClient.createdAt).toISOString().slice(0, 10),
        },
        ...prev,
      ]);
      setForm({ name: "", email: "", clientKey: "" });
      setOpen(false);
    }
    setSubmitting(false);
  }
  async function handleEditClient(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch(`/api/users/${editForm.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editForm.name,
        email: editForm.email,
      }),
    });
    if (res.ok) {
      setClients(clients.map((c) => c.id === editForm.id ? { ...c, name: editForm.name, email: editForm.email, key: editForm.clientKey } : c));
      setEditOpen(false);
    }
    setSubmitting(false);
  }
  async function handleDeleteClient() {
    if (!deleteId) return;
    await fetch(`/api/users/${deleteId}`, { method: "DELETE" });
    setClients(clients.filter((c) => c.id !== deleteId));
    setDeleteOpen(false);
    setDeleteId(null);
  }
  function openEditModal(client: any) {
    setEditForm({ id: client.id, name: client.name, email: client.email, clientKey: client.key });
    setEditOpen(true);
  }
  function openDeleteModal(id: string) {
    setDeleteId(id);
    setDeleteOpen(true);
  }

  return (
    <div className="min-h-screen p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold heading-elegant mb-2">إدارة العملاء</h1>
              <p className="text-lg text-muted-foreground">
                إدارة شاملة لجميع العملاء ومعارض الصور الخاصة بهم
              </p>
            </div>
            <Button onClick={() => setOpen(true)} className="btn-primary shadow-luxurious">
              <PlusIcon className="size-5 mr-2" />
              إضافة عميل جديد
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-premium p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <UsersIcon className="size-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">إجمالي العملاء</p>
                <p className="text-2xl font-bold text-foreground">{clients.length}</p>
              </div>
            </div>
          </Card>
          <Card className="card-premium p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <ImageIcon className="size-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الصور</p>
                <p className="text-2xl font-bold text-foreground">{clients.reduce((sum, c) => sum + c.images, 0)}</p>
              </div>
            </div>
          </Card>
          <Card className="card-premium p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <PlusIcon className="size-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">عملاء جدد</p>
                <p className="text-2xl font-bold text-foreground">
                  {clients.filter(c => new Date(c.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Clients Table */}
        <Card className="card-elegant shadow-luxurious">
          <div className="p-6 border-b border-primary-100">
            <h2 className="text-xl font-semibold text-foreground">قائمة العملاء</h2>
            <p className="text-sm text-muted-foreground mt-1">إدارة معلومات العملاء ومعارضهم</p>
          </div>
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader className="bg-gradient-to-r from-primary-50 to-secondary-50">
                <TableRow className="border-b border-primary-200">
                  <TableHead className="text-right font-semibold text-primary-700 py-4">المعرف</TableHead>
                  <TableHead className="text-right font-semibold text-primary-700">معرّف الدخول</TableHead>
                  <TableHead className="text-right font-semibold text-primary-700">الاسم</TableHead>
                  <TableHead className="text-right font-semibold text-primary-700">البريد الإلكتروني</TableHead>
                  <TableHead className="text-right font-semibold text-primary-700">عدد الصور</TableHead>
                  <TableHead className="text-right font-semibold text-primary-700">تاريخ الإنشاء</TableHead>
                  <TableHead className="text-center font-semibold text-primary-700 w-32">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client, index) => (
                  <TableRow key={client.id} className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-transparent transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                    <TableCell className="font-mono text-sm text-muted-foreground py-4">{client.id}</TableCell>
                    <TableCell>
                      <Badge className="badge-commented font-mono font-bold">{client.key}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{client.name}</TableCell>
                    <TableCell className="text-muted-foreground">{client.email}</TableCell>
                    <TableCell>
                      <Badge className={client.images > 0 ? "badge-approved" : "badge-pending"}>
                        {client.images}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{client.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-center">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="hover:bg-blue-50 hover:text-blue-600 transition-colors p-2" 
                          aria-label="عرض"
                          onClick={() => router.push(`/admin/clients/${client.id}`)}
                        >
                          <EyeIcon className="size-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="hover:bg-amber-50 hover:text-amber-600 transition-colors p-2" 
                          aria-label="تعديل"
                          onClick={() => openEditModal(client)}
                        >
                          <PencilIcon className="size-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="hover:bg-red-50 hover:text-red-600 transition-colors p-2" 
                          aria-label="حذف"
                          onClick={() => openDeleteModal(client.id)}
                        >
                          <Trash2Icon className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Add Client Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-gradient text-xl">إضافة عميل جديد</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddClient} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                اسم العميل <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleInput}
                required
                placeholder="مثال: شركة النجاح"
                className="input-elegant"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientKey" className="text-sm font-medium text-foreground">
                معرّف الدخول <span className="text-red-500">*</span>
              </Label>
              <Input
                id="clientKey"
                name="clientKey"
                value={form.clientKey}
                onChange={handleInput}
                required
                placeholder="مثال: ABC12345"
                className="input-elegant font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                البريد الإلكتروني (اختياري)
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleInput}
                placeholder="client@email.com"
                className="input-elegant"
              />
            </div>
            <DialogFooter className="flex-row-reverse gap-3 pt-4">
              <Button 
                type="submit" 
                disabled={submitting || !form.name || !form.clientKey}
                className="btn-primary"
              >
                {submitting ? "جاري الإضافة..." : "إضافة العميل"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)} 
                disabled={submitting}
                className="btn-ghost"
              >
                إلغاء
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="glass max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-gradient text-xl">تعديل بيانات العميل</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditClient} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="editName" className="text-sm font-medium text-foreground">
                اسم العميل <span className="text-red-500">*</span>
              </Label>
              <Input
                id="editName"
                name="name"
                value={editForm.name}
                onChange={handleEditInput}
                required
                placeholder="مثال: شركة النجاح"
                className="input-elegant"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editClientKey" className="text-sm font-medium text-foreground">
                معرّف الدخول <span className="text-red-500">*</span>
              </Label>
              <Input
                id="editClientKey"
                name="clientKey"
                value={editForm.clientKey}
                onChange={handleEditInput}
                required
                placeholder="مثال: ABC12345"
                className="input-elegant font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editEmail" className="text-sm font-medium text-foreground">
                البريد الإلكتروني (اختياري)
              </Label>
              <Input
                id="editEmail"
                name="email"
                type="email"
                value={editForm.email}
                onChange={handleEditInput}
                placeholder="client@email.com"
                className="input-elegant"
              />
            </div>
            <DialogFooter className="flex-row-reverse gap-3 pt-4">
              <Button 
                type="submit" 
                disabled={submitting || !editForm.name || !editForm.clientKey}
                className="btn-primary"
              >
                {submitting ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setEditOpen(false)} 
                disabled={submitting}
                className="btn-ghost"
              >
                إلغاء
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Client Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="glass max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-gradient text-xl">تأكيد حذف العميل</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 font-medium">تحذير: هذا الإجراء لا يمكن التراجع عنه</p>
            </div>
            <p className="text-muted-foreground">
              هل أنت متأكد أنك تريد حذف هذا العميل؟ سيتم حذف جميع الصور والبيانات المرتبطة به نهائياً.
            </p>
          </div>
          <DialogFooter className="flex-row-reverse gap-3">
            <Button 
              onClick={handleDeleteClient}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              حذف نهائياً
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setDeleteOpen(false)}
              className="btn-ghost"
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 