import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // 1. JSON base64 data upload
    if (contentType.includes('application/json')) {
      const body = await req.json();
      const { data, folder = 'general', resource_type = 'auto' } = body;

      if (!data) {
        return NextResponse.json(
          { success: false, message: 'Missing base64 data to upload' },
          { status: 400 }
        );
      }

      const result = await uploadToCloudinary(data, {
        folder: `success_point_school/${folder}`,
        resource_type,
      });

      return NextResponse.json({
        success: true,
        message: 'File uploaded to Cloudinary successfully!',
        ...result,
      });
    }

    // 2. FormData file upload
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const folder = (formData.get('folder') as string) || 'general';

      if (!file) {
        return NextResponse.json(
          { success: false, message: 'No file provided in form data' },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // determine resource type based on mime type
      const mime = file.type || '';
      let resource_type: 'image' | 'raw' | 'video' | 'auto' = 'auto';
      if (mime.startsWith('image/')) resource_type = 'image';
      else if (mime.startsWith('video/')) resource_type = 'video';
      else if (mime.includes('pdf') || mime.includes('document')) resource_type = 'raw';

      const result = await uploadToCloudinary(buffer, {
        folder: `success_point_school/${folder}`,
        resource_type,
      });

      return NextResponse.json({
        success: true,
        message: 'File uploaded to Cloudinary successfully!',
        originalName: file.name,
        size: file.size,
        type: file.type,
        ...result,
      });
    }

    return NextResponse.json(
      { success: false, message: 'Unsupported Content-Type. Use multipart/form-data or application/json.' },
      { status: 400 }
    );
  } catch (err: any) {
    console.error('Cloudinary API upload error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to upload to Cloudinary' },
      { status: 500 }
    );
  }
}
