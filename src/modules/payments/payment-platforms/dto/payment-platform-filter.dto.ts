import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaymentPlatformFilterDto {
  @ApiPropertyOptional({
    description: 'Código único de la plataforma de pago',
    example: 'virtual-bank',
  })
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por si la plataforma está activa o no',
    type: 'boolean',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === true || value === 'true') return true;
    if (value === false || value === 'false') return false;
    return undefined;
  })
  isActive?: boolean;
}
