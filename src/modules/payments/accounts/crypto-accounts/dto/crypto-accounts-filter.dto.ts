import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CryptoAccountFilterDto {
  @ApiPropertyOptional({
    example: 'MERCADOPAGO',
    description: 'Código del proveedor de pago (PaymentProviders.code)',
  })
  @IsOptional()
  @IsString()
  paymentProviderCode?: string;
}
