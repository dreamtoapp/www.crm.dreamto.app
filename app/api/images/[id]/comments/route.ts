import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    if (!id) return NextResponse.json({ error: 'Missing image ID' }, { status: 400 });
    const { authorId, content } = await req.json();
    if (!authorId || !content) return NextResponse.json({ error: 'Missing authorId or content' }, { status: 400 });
    const comment = await db.comment.create({
      data: {
        imageId: id,
        authorId,
        content,
      },
      include: {
        author: { select: { id: true, name: true, role: true, identifier: true } },
      },
    });
    return NextResponse.json(comment);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add comment', details: String(error) }, { status: 500 });
  }
} 