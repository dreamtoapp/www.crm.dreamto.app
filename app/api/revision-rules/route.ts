import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';

// GET /api/revision-rules
export async function GET() {
  const rules = await db.revisionRule.findMany({
    orderBy: { order: 'asc' },
  });
  return NextResponse.json(rules);
}

// POST /api/revision-rules (admin only)
export async function POST(req: NextRequest) {
  // TODO: Add admin authentication/authorization check here
  const { text, order } = await req.json();
  if (!text) {
    return NextResponse.json({ error: 'Text is required' }, { status: 400 });
  }
  const rule = await db.revisionRule.create({
    data: { text, order: order ?? 0 },
  });
  return NextResponse.json(rule, { status: 201 });
} 