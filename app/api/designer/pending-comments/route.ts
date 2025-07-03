import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const designerId = req.nextUrl.searchParams.get('designerId');
  if (!designerId) {
    return NextResponse.json({ error: 'designerId is required' }, { status: 400 });
  }

  // 1. Find all top-level client comments for this designer
  const comments = await prisma.comment.findMany({
    where: {
      parentId: null,
      authorRole: 'CLIENT',
      designerId,
      isDeleted: false,
    },
    include: {
      author: true,
      image: true,
      children: true,
    },
  });

  // 2. Filter out comments that have a designer reply
  const pending = comments.filter((comment: any) =>
    !comment.children.some((child: any) => child.authorRole === 'DESIGNER')
  );

  // 3. Format for frontend
  const result = pending.map((comment: any) => ({
    id: comment.id,
    imageId: comment.imageId,
    imageUrl: comment.image.url,
    client: comment.author.name,
    clientId: comment.author.id,
    content: comment.content,
    date: comment.createdAt,
  }));

  return NextResponse.json(result);
} 