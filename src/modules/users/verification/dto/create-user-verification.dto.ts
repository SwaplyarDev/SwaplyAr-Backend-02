import { ApiProperty } from '@nestjs/swagger';

export class UploadFilesDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Imagen del frente del documento de identidad',
  })
  document_front: any;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Imagen del reverso del documento de identidad',
  })
  document_back: any;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Selfie del usuario sosteniendo el documento de identidad',
  })
  selfie_image: any;
}
