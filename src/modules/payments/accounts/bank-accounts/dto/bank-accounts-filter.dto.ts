import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsString, Length } from 'class-validator';

export class BankAccountFilterDto {
  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'Filtrar por ID de proveedor de pago',
  })
  @IsOptional()
  @IsUUID()
  paymentProviderId?: string;

  @ApiPropertyOptional({
    example: 'USD',
    description: 'Filtrar por moneda (ISO 4217: ARS, USD, EUR...)',
  })
  @IsOptional()
  @IsString()
  @Length(2, 3)
  currency?: string;
}
