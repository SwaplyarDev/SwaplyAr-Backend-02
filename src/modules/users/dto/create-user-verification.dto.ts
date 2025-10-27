import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserVerificationDto {
  @ApiProperty({
    description: 'URL de la imagen del frente del documento de identidad',
  })
  @IsString()
  @IsNotEmpty()
  document_front: string;

  @ApiProperty({
    description: 'URL de la imagen del reverso del documento de identidad',
  })
  @IsString()
  @IsNotEmpty()
  document_back: string;

  @ApiProperty({
    description: 'URL de la selfie del usuario para verificación',
  })
  @IsString()
  @IsNotEmpty()
  selfie_image: string;

  @ApiProperty({
    description: 'Nota de rechazo opcional',
    required: false,
  })
  @IsOptional()
  @IsString()
  note_rejection?: string;
}

export class UploadFilesDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Imagen del frente del documento',
  })
  document_front: any;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Imagen del reverso del documento',
  })
  document_back: any;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Selfie sosteniendo el documento',
  })
  selfie_image: any;
}
