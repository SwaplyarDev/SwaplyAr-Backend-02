import { ApiProperty } from '@nestjs/swagger';

export class DiscountCodeDto {
  @ApiProperty({
    description: 'ID único del descuento',
    example: '1a9dad84-1f94-4355-bd4c-2c8b1ef2bdd1',
  })
  id: string;

  @ApiProperty({
    description: 'Codigo del descuento',
    example: 'WELCOME-TT8U49',
  })
  code: string;

  @ApiProperty({
    description: 'Valor del descuento',
    example: 3,
  })
  value: number;

  @ApiProperty({
    description: 'Código de moneda ISO 4217 (ej: USD, EUR)',
    example: 'USD',
  })
  currencyCode: string;

  @ApiProperty({
    description: 'Fecha desde la cual el descuento es valido',
    example: '2025-09-17T16:36:50.529Z',
  })
  validFrom: Date;

  @ApiProperty({
    description: 'Fecha de creación/asignación del descuento',
    example: '2025-09-17T16:36:50.534Z',
  })
  createdAt: Date;
}

export class DiscountDataDto {
  @ApiProperty({
    description: 'ID único del',
    example: '38ed61fd-24c1-40c2-8ccd-c1f4458f3037',
  })
  id: string;

  @ApiProperty({ type: DiscountCodeDto })
  discountCode: DiscountCodeDto;

  @ApiProperty({
    description: 'Indica si el cupón ya fue usado',
    example: true,
  })
  isUsed: boolean;

  @ApiProperty({
    description: 'Fecha de creación/asignación del descuento',
    example: '2025-09-17T16:36:50.570Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha en que el descuento fue utilizado (si aplica)',
    example: null,
    nullable: true,
  })
  usedAt?: Date | null;

  @ApiProperty({
    description: 'Fecha de actualización del descuento',
    example: '2025-08-01T00:00:00Z',
  })
  updatedAt: Date;
}

export class UserDiscountsFromUserDto {
  @ApiProperty({ type: () => [DiscountDataDto] })
  data: DiscountDataDto[];
}
