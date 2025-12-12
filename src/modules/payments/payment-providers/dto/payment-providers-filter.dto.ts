import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

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
    example: 'BTC',
    description: 'Código de crypto network (solo crypto accounts)',
  })
  @IsOptional()
  @IsString()
  cryptoNetworkCode?: string;
}
