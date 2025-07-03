import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';

// PUT /api/revision-requests/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    // Find the revision request
    const revisionRequest = await db.revisionRequest.findUnique({ where: { id } });
    if (!revisionRequest) {
      return NextResponse.json({ error: 'Revision request not found' }, { status: 404 });
    }
    if (revisionRequest.status !== 'PENDING') {
      return NextResponse.json({ error: 'Only PENDING requests can be marked as done' }, { status: 400 });
    }
    // Update status to DONE and set doneAt
    const updated = await db.revisionRequest.update({
      where: { id },
      data: { status: 'DONE', doneAt: new Date() },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
} 