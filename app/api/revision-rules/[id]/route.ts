import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';

// PUT /api/revision-rules/[id] (admin only)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // TODO: Add admin authentication/authorization check here
  const { id } = await params;
  const { text, order } = await req.json();
  if (!text) {
    return NextResponse.json({ error: 'Text is required' }, { status: 400 });
  }
  const rule = await db.revisionRule.update({
    where: { id },
    data: { text, order: order ?? 0 },
  });
  return NextResponse.json(rule);
}

// DELETE /api/revision-rules/[id] (admin only)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // TODO: Add admin authentication/authorization check here
  const { id } = await params;
  await db.revisionRule.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 