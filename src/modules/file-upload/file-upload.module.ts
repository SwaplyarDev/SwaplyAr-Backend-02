import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { CloudinaryService } from 'src/service/cloudinary/cloudinary.service';

@Module({
  controllers: [],
  providers: [FileUploadService,CloudinaryService],
})
export class FileUploadModule {}
