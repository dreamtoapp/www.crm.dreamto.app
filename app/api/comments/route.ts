import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';

// GET /api/comments?imageId=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const imageId = searchParams.get('imageId');
  if (!imageId) return NextResponse.json([]);
  const comments = await db.comment.findMany({
    where: { imageId },
    orderBy: { createdAt: 'asc' },
    include: {
      author: { select: { id: true, name: true, role: true } },
    },
  });
  return NextResponse.json(comments);
}

// POST /api/comments
export async function POST(req: NextRequest) {
  // TODO: Replace with real auth check
  // const user = await getSessionUser(req);
  // if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { imageId, authorId, content, parentId } = body;
  if (!imageId || !authorId || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  // Validate parentId if present
  if (parentId) {
    const parent = await db.comment.findUnique({ where: { id: parentId } });
    if (!parent || parent.imageId !== imageId) {
      return NextResponse.json({ error: 'Invalid parentId' }, { status: 400 });
    }
  }
  // Fetch the image to get designerId
  const image = await db.image.findUnique({ where: { id: imageId } });
  if (!image) {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  }
  // Fetch the user to get authorRole
  const user = await db.user.findUnique({ where: { id: authorId } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  const comment = await db.comment.create({
    data: {
      imageId,
      authorId,
      content,
      parentId,
      designerId: image.uploaderId,
      authorRole: user.role,
    },
    include: {
      author: { select: { id: true, name: true, role: true } },
    },
  });
  return NextResponse.json(comment);
} 