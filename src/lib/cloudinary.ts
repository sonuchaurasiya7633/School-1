import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dqpbo1uho',
  api_key: process.env.CLOUDINARY_API_KEY || '799249777964973',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'KfG42ZDq87b_BMQJrix_8hNag_4',
  secure: true,
});

export default cloudinary;

export interface CloudinaryUploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  format?: string;
  bytes?: number;
}

/**
 * Upload a Buffer or Base64 string to Cloudinary
 */
export async function uploadToCloudinary(
  fileData: Buffer | string,
  options: {
    folder?: string;
    resource_type?: 'image' | 'raw' | 'video' | 'auto';
    public_id?: string;
  } = {}
): Promise<CloudinaryUploadResult> {
  const folder = options.folder || 'success_point_school';
  const resource_type = options.resource_type || 'auto';

  return new Promise((resolve, reject) => {
    if (typeof fileData === 'string' && fileData.startsWith('data:')) {
      cloudinary.uploader.upload(
        fileData,
        {
          folder,
          resource_type,
          public_id: options.public_id,
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('Upload to Cloudinary failed'));
          }
          resolve({
            url: result.url,
            secure_url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            bytes: result.bytes,
          });
        }
      );
    } else {
      const buffer = Buffer.isBuffer(fileData) ? fileData : Buffer.from(fileData);
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type,
          public_id: options.public_id,
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('Upload to Cloudinary failed'));
          }
          resolve({
            url: result.url,
            secure_url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            bytes: result.bytes,
          });
        }
      );
      uploadStream.end(buffer);
    }
  });
}
