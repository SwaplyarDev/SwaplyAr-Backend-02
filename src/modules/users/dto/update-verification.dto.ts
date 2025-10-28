import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateVerificationDto {
  @ApiPropertyOptional({
    description: 'Estado de verificación',
    example: 'verified',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'Motivo de rechazo',
    example: 'Documento ilegible o dañado',
  })
  @IsOptional()
  @IsString()
  note_rejection?: string;
}
