import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads an image to Cloudinary.
 * @param file Buffer or base64 string of the image
 * @param filename Optional filename (for public_id)
 * @returns { secure_url, public_id, ... }
 */
export async function uploadImage(file: Buffer | string, filename?: string) {
  const folder = process.env.CLOUDINARY_CLIENT_FOLDER || 'uploads';
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        upload_preset: uploadPreset,
        public_id: filename,
        resource_type: 'image',
      },
      (error, result) => {
        if (error || !result) return reject(error || new Error('Cloudinary upload failed'));
        resolve(result);
      }
    );
    if (typeof file === 'string') {
      // base64 string
      const buffer = Buffer.from(file.split(',')[1], 'base64');
      stream.end(buffer);
    } else {
      // Buffer
      stream.end(file);
    }
  });
}

export default cloudinary; 