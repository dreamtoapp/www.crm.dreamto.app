import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const where: any = {};
    if (searchParams.has('clientName')) where.clientName = searchParams.get('clientName');
    if (searchParams.has('designType')) where.designType = searchParams.get('designType');
    if (searchParams.has('designTypeId')) where.designTypeId = searchParams.get('designTypeId');
    if (searchParams.has('uploaderId')) where.uploaderId = searchParams.get('uploaderId');

    console.log('--- /api/images QUERY DEBUG ---');
    console.log('Query params:', Object.fromEntries(searchParams.entries()));
    console.log('Prisma where:', where);

    const images = await db.image.findMany({
      where,
      include: {
        uploader: { select: { id: true, name: true, role: true, identifier: true } },
        comments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    console.log('Images found:', images.length);
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error in /api/images:', error);
    return NextResponse.json({ error: 'Failed to fetch images', details: String(error) }, { status: 500 });
  }
} 