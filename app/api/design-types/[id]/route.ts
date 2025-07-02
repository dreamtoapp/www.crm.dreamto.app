import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';

export const runtime = 'nodejs';

// GET: Get a single design type by id
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const type = await db.designType.findUnique({ where: { id } });
    if (!type) return NextResponse.json({ error: 'Design type not found' }, { status: 404 });
    return NextResponse.json(type);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch design type', details: String(error) }, { status: 500 });
  }
}

// PATCH: Update a design type
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { name, description } = await req.json();
    const type = await db.designType.update({ where: { id }, data: { name, description } });
    return NextResponse.json(type);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Design type name must be unique' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update design type', details: String(error) }, { status: 500 });
  }
}

// DELETE: Delete a design type
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await db.designType.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete design type', details: String(error) }, { status: 500 });
  }
} 