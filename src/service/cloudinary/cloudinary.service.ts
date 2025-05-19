import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from 'cloudinary';
import * as dotenv from 'dotenv';

@Injectable()
export class CloudinaryService {
  constructor() {
    dotenv.config({ path: '.env.local' });
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
      api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
    });
  }

  async uploadFile(buffer: Buffer, folder:string, fileName: string ): Promise<string> {
    const options: UploadApiOptions = {
      folder: folder,
      public_id: fileName,
      resource_type: 'auto'
    };

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        options,
        (error, result: UploadApiResponse) => {
          error ? reject(error) : resolve(result.secure_url);
        },
      );
      stream.write(buffer);
      stream.end();
    });
  }
}