import { ApiProperty } from '@nestjs/swagger';

export class CommissionResponseDto {
  @ApiProperty({ example: 'PayPal USD', description: 'Id de origen de la transacción.' })
  fromPlatformId: string;

  @ApiProperty({ example: 'Payoneer EUR', description: 'Id de destino de la transacción.' })
  toPlatformId: string;

  @ApiProperty({
    example: 85.39001438,
    description: 'Monto base sobre el que se calculó la comisión.',
  })
  amount: number;

  @ApiProperty({
    example: 0.14,
    description: 'Porcentaje de comisión aplicado (ejemplo: 0.14 = 14%).',
  })
  commissionRate: number;

  @ApiProperty({
    example: 11.95,
    description: 'Valor de la comisión calculada.',
  })
  commissionValue: number;

  @ApiProperty({
    example: 73.44,
    description: 'Monto final después de aplicar la comisión.',
  })
  finalAmount: number;

  @ApiProperty({
    example: 'Comisión calculada correctamente.',
    description: 'Mensaje informativo del resultado.',
  })
  message: string;
}
