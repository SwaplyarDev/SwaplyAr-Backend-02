

import { ApiProperty } from '@nestjs/swagger';

export class ConversionResponseDto {
  @ApiProperty({ example: 'USD', description: 'Código de la divisa o moneda origen' })
  from: string;

  @ApiProperty({ example: 'EUR', description: 'Código de la divisa o moneda destino' })
  to: string;

  @ApiProperty({ example: 100, description: 'Cantidad solicitada para convertir' })
  amount: number;

  @ApiProperty({ example: 110, description: 'Cantidad resultante de la conversión' })
  convertedAmount: number;

  @ApiProperty({ example: 1.172470180808886, description: 'Tasa de conversión usada en el cálculo' })
  rateUsed: number;

  @ApiProperty({ example: 'Conversión realizada correctamente ...', description: 'Mensaje informativo' })
  message: string;
}
