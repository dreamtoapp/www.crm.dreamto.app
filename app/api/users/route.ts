import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';
import { Role } from '@prisma/client';
// test
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = (searchParams.get('role') as Role) || Role.CLIENT;
    // Use correct relation for image count
    const include = role === Role.CLIENT
      ? { clientImages: true }
      : { images: true };
    const users = await db.user.findMany({
      where: { role },
      include,
      orderBy: { createdAt: 'desc' },
    });
    // Map to expected format
    const result = users.map((u: any) => ({
      id: u.id,
      key: u.identifier,
      name: u.name,
      email: u.email || '',
      images: role === Role.CLIENT ? u.clientImages.length : u.images.length,
      createdAt: u.createdAt.toISOString().slice(0, 10),
    }));
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users', details: String(error) }, { status: 500 });
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