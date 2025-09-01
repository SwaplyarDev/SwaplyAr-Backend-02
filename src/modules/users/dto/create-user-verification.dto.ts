import { IsString, IsOptional, IsEnum, IsNotEmpty, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VerificationStatus } from '@users/entities/user-verification.entity';
import { Type } from 'class-transformer';

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

export class GetVerificationsQueryDto {
  @IsOptional()
  @IsEnum(VerificationStatus, {
    message: 'El status debe ser uno de: pending, verified, rejected, resend-data',
  })
  status?: VerificationStatus;

  @ApiPropertyOptional({ description: 'Número de página', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Cantidad de resultados por página',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
