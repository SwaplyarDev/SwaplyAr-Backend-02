import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserVerificationDto {
  @ApiProperty({
    description: 'URL de la imagen del frente del documento de identidad',
  })
  @IsString()
  document_front: string;

  @ApiProperty({
    description: 'URL de la imagen del reverso del documento de identidad',
  })
  @IsString()
  document_back: string;

  @ApiProperty({
    description: 'URL de la selfie del usuario para verificación',
  })
  @IsString()
  selfie_image: string;

  @ApiProperty({
    description: 'Nota de rechazo opcional',
    required: false,
  })
  @IsOptional()
  @IsString()
  note_rejection?: string;
}
