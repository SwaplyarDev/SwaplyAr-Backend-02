import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class UpdateVerificationDto {
  @ApiProperty({
    description: 'Nuevo estado de verificación',
    example: 'verified',
    enum: ['verified', 'rejected', 'resend-data'],
  })
  @IsString()
  status: string;

  @ApiPropertyOptional({
    description: 'Motivo del rechazo (obligatorio solo si status es "rejected o "resend-data")',
    example: 'Documento ilegible o dañado',
  })
  @IsOptional()
  @IsString()
  note_rejection?: string;
}
