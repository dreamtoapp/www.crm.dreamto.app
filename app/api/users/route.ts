import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const users = await db.user.findMany({
      where: { role: 'CLIENT' },
      include: { images: true },
      orderBy: { createdAt: 'desc' },
    });
    // Map to expected client format
    const clients = users.map((u: any) => ({
      id: u.id,
      key: u.identifier,
      name: u.name,
      email: u.email || '',
      images: u.images.length,
      createdAt: u.createdAt.toISOString().slice(0, 10),
    }));
    return NextResponse.json(clients);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch clients', details: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, role, identifier, email } = await req.json();
    if (!name || !role || !identifier) return NextResponse.json({ error: 'Missing name, role, or identifier' }, { status: 400 });
    const user = await db.user.create({
      data: { name, role, identifier, email },
    });
    return NextResponse.json(user);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Identifier already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create user', details: String(error) }, { status: 500 });
  }
} 