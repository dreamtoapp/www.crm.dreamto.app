import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';

// GET /api/revision-requests?imageId=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const imageId = searchParams.get('imageId');
  if (!imageId) return NextResponse.json([]);
  const requests = await db.revisionRequest.findMany({
    where: { imageId },
    orderBy: { createdAt: 'desc' },
  });
  console.log('Fetched revision requests:', requests);
  return NextResponse.json(requests);
} 