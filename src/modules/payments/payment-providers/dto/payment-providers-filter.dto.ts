import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaymentProvidersFilterDto {
  @ApiPropertyOptional({
    example: 'virtual-bank',
    description: 'Código de la plataforma de pago (payment_platforms.code)',
  })
  @IsOptional()
  @IsString()
  platformCode?: string;

  @ApiPropertyOptional({
    example: 'ARGENTINA',
    description: 'Código del proveedor de pago (payment_providers.code)',
  })
  @IsOptional()
  @IsString()
  providerCode?: string;

  @ApiPropertyOptional({
    example: 'USD',
    description: 'Código de moneda (solo bank/virtual-bank accounts)',
  })
  @IsOptional()
  @IsString()
  @Length(2, 3)
  fiatCurrencyCode?: string;

  @ApiPropertyOptional({
    example: 'CHL',
    description: 'Código de país ISO 3166 (ej: ARG, BRA, CHL)',
  })
  @IsOptional()
  @IsString()
  countryCode?: string;

  @ApiPropertyOptional({
    example: 'BTC',
    description: 'Código de crypto network (solo crypto accounts)',
  })
  @IsOptional()
  @IsString()
  cryptoNetworkCode?: string;

  @ApiPropertyOptional({
    example: 'true',
    description: 'Filtra si el proveedor de pago esta activo o no',
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
