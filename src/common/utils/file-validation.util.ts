import { BadRequestException } from '@nestjs/common';

export function validateMaxFiles(files: any[], maxFiles = 5, maxSizeMB = 3): void {
  if (!files || files.length === 0) {
    throw new BadRequestException('Debe proporcionar al menos un archivo.');
  }

  if (files.length > maxFiles) {
    throw new BadRequestException(`Solo se permiten hasta ${maxFiles} archivos.`);
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  for (const file of files) {
    if (file.size > maxSizeBytes) {
      throw new BadRequestException(
        `Cada archivo debe pesar menos de ${maxSizeMB} MB. El archivo "${file.originalName || file.originalname}" excede el límite.`,
      );
    }
  }
}