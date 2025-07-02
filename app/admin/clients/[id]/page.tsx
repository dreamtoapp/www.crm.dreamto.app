import db from '@/lib/prisma';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EyeIcon, MessageCircleIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminClientGalleryPage({ params }: Props) {
  const { id } = await params;
  const client = await db.user.findUnique({
    where: { id },
    include: {
      images: {
        include: {
          comments: true,
        },
      },
    },
  });

  if (!client) return notFound();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <Card className="w-full max-w-3xl p-6 flex flex-col gap-4 items-center">
        <h1 className="text-2xl font-bold mb-2">معرض صور العميل</h1>
        {client.images.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">لا توجد صور لهذا العميل بعد.</div>
        ) : (
          <Table className="w-full rtl text-right">
            <TableHeader>
              <TableRow>
                <TableHead>الصورة</TableHead>
                <TableHead>الوسم</TableHead>
                <TableHead>الرافع</TableHead>
                <TableHead>تاريخ الرفع</TableHead>
                <TableHead>التعليقات</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {client.images.map((img: any) => (
                <TableRow key={img.id}>
                  <TableCell>
                    <Image src={img.url} alt="صورة" width={48} height={48} className="rounded-md object-cover" />
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{img.designType}</Badge>
                  </TableCell>
                  <TableCell>{img.uploaderId}</TableCell>
                  <TableCell>{new Date(img.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="flex items-center gap-1">
                    <MessageCircleIcon className="size-4 text-muted-foreground" />
                    {img.comments?.length || 0}
                  </TableCell>
                  <TableCell>
                    <Button size="icon" variant="ghost" aria-label="عرض الصورة">
                      <EyeIcon className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
} 