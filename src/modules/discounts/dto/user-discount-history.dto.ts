import { ApiProperty } from '@nestjs/swagger';

export class UserDiscountHistoryDto {
  @ApiProperty({
    description: 'ID único del descuento asignado al usuario',
    example: '7d3f31b2-2c45-4a2a-b3b0-8e4f8bfa3a4e',
  })
  id: string;

  @ApiProperty({
    description: 'Código de descuento utilizado',
    example: 'WELCOME-2025',
  })
  code: string;

  @ApiProperty({
    description: 'Valor del descuento aplicado',
    example: 10,
  })
  value: number;

  @ApiProperty({
    description: 'Código de moneda ISO 4217 (ej: USD, EUR)',
    example: 'USD',
  })
  currencyCode: string;

  @ApiProperty({
    description: 'Indica si el cupón ya fue usado',
    example: true,
  })
  isUsed: boolean;

  @ApiProperty({
    description: 'Fecha de creación/asignación del descuento',
    example: '2025-08-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha en que el descuento fue utilizado (si aplica)',
    example: '2025-08-05T12:34:56Z',
    nullable: true,
  })
  usedAt?: Date | null;
}
