import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';

// GET /api/settings/max-revision-requests
export async function GET() {
  const setting = await db.setting.findUnique({ where: { key: 'max_revision_requests' } });
  return NextResponse.json({ value: setting?.value ?? null });
}

// PUT /api/settings/max-revision-requests (admin only)
export async function PUT(req: NextRequest) {
  // TODO: Add admin authentication/authorization check here
  const { value } = await req.json();
  if (!value || isNaN(Number(value)) || Number(value) < 1) {
    return NextResponse.json({ error: 'Value must be a positive number' }, { status: 400 });
  }
  const setting = await db.setting.upsert({
    where: { key: 'max_revision_requests' },
    update: { value: String(value) },
    create: { key: 'max_revision_requests', value: String(value) },
  });
  return NextResponse.json({ value: setting.value });
} 