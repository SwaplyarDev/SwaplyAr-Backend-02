import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class VirtualBankAccountFilterDto {
  @ApiPropertyOptional({
    example: 'MERCADOPAGO',
    description: 'Código del proveedor de pago (PaymentProviders.code)',
  })
  @IsOptional()
  @IsString()
  paymentProviderCode?: string;

  @ApiPropertyOptional({
    example: 'USD',
    description: 'Filtrar por moneda (ISO 4217: ARS, USD, EUR...)',
  })
  @IsOptional()
  @IsString()
  @Length(2, 3)
  currency?: string;
}
