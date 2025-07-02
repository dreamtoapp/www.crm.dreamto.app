import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
import db from '@/lib/prisma';

export const runtime = 'nodejs'; // Ensure Node.js runtime for file uploads

export async function POST(req: NextRequest) {
  try {
    // Parse form data
    const formData = await req.formData();
    const file = formData.get('file');
    const uploaderId = formData.get('uploaderId');
    const clientId = formData.get('clientId');
    const clientName = formData.get('clientName');
    const designTypeId = formData.get('designTypeId');

    if (!file || typeof uploaderId !== 'string' || typeof clientId !== 'string' || typeof clientName !== 'string' || typeof designTypeId !== 'string') {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Invalid file upload.' }, { status: 400 });
    }

    // Validate designTypeId exists
    const designType = await db.designType.findUnique({ where: { id: designTypeId } });
    if (!designType) {
      return NextResponse.json({ error: 'Invalid design type.' }, { status: 400 });
    }

    // Read file as buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const filename = (file as File).name || undefined;
    const result: any = await uploadImage(buffer, clientName, filename);

    // Build optimized Cloudinary URL
    const baseUrl = result.secure_url.split('/upload/').join('/upload/f_auto,q_auto,w_800/');
    // Save to DB
    const image = await db.image.create({
      data: {
        url: baseUrl,
        publicId: result.public_id,
        uploaderId,
        clientId,
        clientName,
        designTypeId,
      },
    });

    return NextResponse.json({ image });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Image upload failed.' }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
} 