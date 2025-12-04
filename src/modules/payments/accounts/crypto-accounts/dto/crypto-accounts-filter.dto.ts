import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class CryptoAccountFilterDto {
  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'Filtrar por ID de proveedor de pago',
  })
  @IsOptional()
  @IsUUID()
  paymentProviderId?: string;
}
