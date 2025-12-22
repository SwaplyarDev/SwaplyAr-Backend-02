import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CryptoAccountFilterDto {
  @ApiPropertyOptional({
    example: 'BINANCE',
    description: 'Código del proveedor de pago (PaymentProviders.code)',
  })
  @IsOptional()
  @IsString()
  paymentProviderCode?: string;

  @ApiPropertyOptional({
    example: 'USDT',
    description: 'Código de la moneda asociada a la cuenta crypto (Currency.code)',
  })
  @IsOptional()
  @IsString()
  @Length(2, 5)
  currencyCode?: string;
}
