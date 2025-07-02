import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const where: any = {};
    if (searchParams.has('clientName')) where.clientName = searchParams.get('clientName');
    if (searchParams.has('designType')) where.designType = searchParams.get('designType');
    if (searchParams.has('uploaderId')) where.uploaderId = searchParams.get('uploaderId');

    const images = await db.image.findMany({
      where,
      include: {
        uploader: { select: { id: true, name: true, role: true, identifier: true } },
        comments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch images', details: String(error) }, { status: 500 });
  }
} 