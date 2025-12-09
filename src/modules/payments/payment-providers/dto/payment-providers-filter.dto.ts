import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class MyAvailableProvidersFilterDto {
  @ApiPropertyOptional({
    example: 'virtual-bank',
    description: 'Código de la plataforma de pago (payment_platforms.code)',
  })
  @IsOptional()
  @IsString()
  platform?: string;

  @ApiPropertyOptional({
    example: 'USD',
    description: 'Código de moneda ISO 4217',
  })
  @IsOptional()
  @IsString()
  @Length(2, 3)
  currency?: string;
}
