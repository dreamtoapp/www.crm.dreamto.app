import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    if (!id) return NextResponse.json({ error: 'Missing image ID' }, { status: 400 });
    const image = await db.image.findUnique({
      where: { id },
      include: {
        uploader: { select: { id: true, name: true, role: true, identifier: true } },
        comments: { include: { author: { select: { id: true, name: true, role: true, identifier: true } } } },
      },
    });
    if (!image) return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    return NextResponse.json(image);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch image', details: String(error) }, { status: 500 });
  }
} 