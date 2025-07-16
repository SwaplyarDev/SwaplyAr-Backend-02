import { IsNotEmpty, IsString, IsInt, Min, IsISO8601 } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDiscountCodeDto {
  @ApiProperty({ description: 'Código alfanumérico único' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ description: 'Valor fijo del descuento (entero)' })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  value: number;

  @ApiProperty({ description: 'Moneda del descuento, p.ej. USD' })
  @IsNotEmpty()
  @IsString()
  currencyCode: string;

  @ApiProperty({
    description: 'Fecha de inicio de validez en ISO8601',
    example: '2025-07-20T00:00:00Z',
  })
  @IsNotEmpty()
  @IsISO8601()
  validFrom: string;
}
