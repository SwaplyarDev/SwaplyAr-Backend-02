import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/service/cloudinary/cloudinary.service';
import { FileUploadDTO } from './dto/file-upload.dto';

@Injectable()
export class FileUploadService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadFile(file: FileUploadDTO, folder: string, fileName: string): Promise<string> {
    const url = await this.cloudinaryService.uploadFile(file.buffer, folder, fileName);
    return url;
  }
}
