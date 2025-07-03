import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';

// GET /api/users/[id]/revision-rules-confirmed
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await db.user.findUnique({ where: { identifier: id } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json({ revisionRulesConfirmed: user.revisionRulesConfirmed });
}

// PUT /api/users/[id]/revision-rules-confirmed
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const value = !!body.value;
  const user = await db.user.update({
    where: { identifier: id },
    data: { revisionRulesConfirmed: value },
  });
  return NextResponse.json({ revisionRulesConfirmed: user.revisionRulesConfirmed });
} 