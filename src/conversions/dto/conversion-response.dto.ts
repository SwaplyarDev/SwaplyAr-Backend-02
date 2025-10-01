

import { ApiProperty } from '@nestjs/swagger';

export class ConversionResponseDto {
  @ApiProperty({ example: 'USD' })
  from: string;

  @ApiProperty({ example: 'EUR' })
  to: string;

  @ApiProperty({ example: 100 })
  amount: number;

  @ApiProperty({ example: 110 })
  convertedAmount: number;

  @ApiProperty({ example: 1.1 })
  rateUsed: number;

  @ApiProperty({ example: 'Conversión realizada correctamente' })
  message: string;
}
