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
    if (searchParams.has('uploaderIdentifier')) {
      const designer = await db.user.findUnique({ where: { identifier: searchParams.get('uploaderIdentifier')! } });
      if (designer) where.uploaderId = designer.id;
      else where.uploaderId = '___NO_MATCH___'; // will return no results
    }
    if (searchParams.has('clientId')) where.clientId = searchParams.get('clientId');

    console.log('--- /api/images QUERY DEBUG ---');
    console.log('Query params:', Object.fromEntries(searchParams.entries()));
    console.log('Prisma where:', where);

    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;

    // Count total images for pagination
    const total = await db.image.count({ where });

    const images = await db.image.findMany({
      where,
      include: {
        uploader: { select: { id: true, name: true, role: true, identifier: true } },
        comments: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });
    const hasMore = skip + images.length < total;
    return NextResponse.json({ images, total, hasMore, page, limit });
  } catch (error) {
    console.error('Error in /api/images:', error);
    return NextResponse.json({ error: 'Failed to fetch images', details: String(error) }, { status: 500 });
  }
} 