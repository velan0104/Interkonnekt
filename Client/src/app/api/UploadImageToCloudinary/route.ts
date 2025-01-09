// pages/api/upload.ts
import { IncomingForm } from 'formidable';
import { NextRequest, NextResponse } from 'next/server';
import cloudinary from 'next-cloudinary';
import fs from 'fs';

// Handle file upload request
export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parser for file uploads
  },
};

export async function POST(req: NextRequest) {
  const form = new IncomingForm();

  // Return a promise from the form parsing function
  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return reject(
          NextResponse.json({ error: 'Something went wrong during file parsing.' }, { status: 500 })
        );
      }

      const file = files.file[0];

      try {
        // Upload to Cloudinary
        const uploadResult = await cloudinary.v2.uploader.upload(file.filepath, {
          folder: 'nextjs_uploads', // Specify the folder on Cloudinary
        });

        resolve(
          NextResponse.json({
            message: 'Upload successful',
            url: uploadResult.secure_url, // Return the URL of the uploaded image
          })
        );
      } catch (uploadError) {
        reject(NextResponse.json({ error: 'Failed to upload image to Cloudinary.' }, { status: 500 }));
      } finally {
        // Clean up the file from the server
        fs.unlinkSync(file.filepath);
      }
    });
  });
}
