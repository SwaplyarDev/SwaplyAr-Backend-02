import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VerificationStatus } from '@users/entities/user-verification.entity';

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


export class GetVerificationsQueryDto {
  @IsOptional()
  @IsEnum(VerificationStatus, {
    message:
      'El status debe ser uno de: pending, verified, rejected, resend-data',
  })
  status?: VerificationStatus;
}