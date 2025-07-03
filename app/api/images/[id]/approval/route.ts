import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { action, feedback } = await req.json();
    const { id: imageId } = await params;

    // Validate action
    const validActions = ['approve', 'reject', 'revision'];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
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

    // Update image status based on action
    const updateData: any = {};
    
    switch (action) {
      case 'approve':
        updateData.status = 'APPROVED';
        updateData.approvedAt = new Date();
        updateData.clientFeedback = null;
        updateData.rejectionReason = null;
        break;
      
      case 'reject':
        if (!feedback || !feedback.trim()) {
          return NextResponse.json(
            { error: 'Reason is required for rejection' },
            { status: 400 }
          );
        }
        updateData.status = 'REJECTED';
        updateData.rejectedAt = new Date();
        updateData.rejectionReason = feedback;
        updateData.clientFeedback = null;
        break;
      
      case 'revision':
        if (!feedback || !feedback.trim()) {
          return NextResponse.json(
            { error: 'Feedback is required for revision requests' },
            { status: 400 }
          );
        }
        updateData.status = 'REVISION_REQUESTED';
        updateData.clientFeedback = feedback;
        updateData.rejectionReason = null;
        // Create a new RevisionRequest record
        await db.revisionRequest.create({
          data: {
            imageId: imageId,
            clientId: image.clientId,
            designerId: image.uploaderId,
            feedback,
            status: 'PENDING',
          },
        });
        break;
    }

    // Update the image
    const updatedImage = await db.image.update({
      where: { id: imageId },
      data: updateData
    });

    // Get the new count of revision requests
    const revisionRequestCount = await db.revisionRequest.count({ where: { imageId } });

    return NextResponse.json({
      success: true,
      image: updatedImage,
      revisionRequestCount
    });

  } catch (error) {
    console.error('Error updating image approval status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 