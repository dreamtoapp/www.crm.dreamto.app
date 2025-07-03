import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';

export const runtime = 'nodejs';

// GET: List all design types
export async function GET(req: NextRequest) {
  try {
    const types = await db.designType.findMany({
      select: { id: true, name: true }
    });
    return NextResponse.json({ types });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch design types', details: String(error) }, { status: 500 });
  }
}

// POST: Create a new design type
export async function POST(req: NextRequest) {
  try {
    const { name, description } = await req.json();
    if (!name) return NextResponse.json({ error: 'Missing name' }, { status: 400 });
    const type = await db.designType.create({ data: { name, description } });
    return NextResponse.json(type);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Design type name must be unique' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create design type', details: String(error) }, { status: 500 });
  }
} 