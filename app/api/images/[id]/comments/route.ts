import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { content, authorId, parentId } = await req.json();
    const { id: imageId } = await params;

    // Validate content
    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }

    // Find the image
    const image = await db.image.findUnique({
      where: { id: imageId }
    });

    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Fetch the user to get authorRole
    const user = await db.user.findUnique({ where: { id: authorId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create the comment
    const comment = await db.comment.create({
      data: {
        content: content.trim(),
        imageId,
        authorId,
        designerId: image.uploaderId,
        authorRole: user.role,
        parentId: parentId || null,
        isDeleted: false,
      },
      include: {
        author: {
          select: {
            name: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      comment: comment
    });

  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 