import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';

export const VerificationFilesInterceptor = FileFieldsInterceptor(
  [
    { name: 'document_front', maxCount: 1 },
    { name: 'document_back', maxCount: 1 },
    { name: 'selfie_image', maxCount: 1 },
  ],
  {
    storage: memoryStorage(),
    fileFilter: (_, file, cb) => {
      if (!file.originalName.match(/\.(jpg|jpeg|png)$/i)) {
        return cb(new BadRequestException('Solo se permiten imágenes (jpg, jpeg, png)'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  },
);
