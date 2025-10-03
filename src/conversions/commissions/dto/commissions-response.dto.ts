

import { ApiProperty } from '@nestjs/swagger';

export class CommissionResponseDto {
  @ApiProperty({ example: 100, description: 'Monto base sobre el que se calculó la comisión' })
  amount: number;

  @ApiProperty({ example: 'payoneer', description: 'Plataforma sobre la que se aplicó la comisión' })
  platform: string;

  @ApiProperty({ example: 0.05, description: 'Porcentaje de comisión aplicado (ejemplo: 0.05 = 5%)' })
  commissionRate: number;

  @ApiProperty({ example: 5, description: 'Valor de la comisión calculada' })
  commissionValue: number;

  @ApiProperty({ example: 95, description: 'Monto final después de aplicar la comisión' })
  finalAmount: number;

  @ApiProperty({ example: 'Comisión calculada correctamente', description: 'Mensaje informativo' })
  message: string;
}
