import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class CreateAmountDto {
  @ApiProperty({ description: 'Cantidad enviada', example: 100 })
  @Type(() => Number) // 👈 convierte string a number
  @IsNumber()
  amountSent: number;

  @ApiProperty({ description: 'Moneda enviada', example: 'ARS' })
  currencySent: string;
 
  @ApiProperty({ description: 'Cantidad recibida', example: 100 })
  @Type(() => Number)
  @IsNumber()
  amountReceived: number;

  @ApiProperty({ description: 'Moneda recibida', example: 'ARS' })
  currencyReceived: string;
}
