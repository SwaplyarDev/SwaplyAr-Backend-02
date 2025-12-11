import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class PaymentPlatformFilterDto {
  @ApiPropertyOptional({
    description: 'Código único de la plataforma de pago',
    example: 'virtual-bank',
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por si la plataforma está activa o no',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
