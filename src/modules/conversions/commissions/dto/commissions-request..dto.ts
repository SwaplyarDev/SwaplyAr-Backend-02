

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CommissionRequestDto {
  @ApiProperty({
    example: 85.39001438,
    description: 'Monto base sobre el que calcular la comisión.',
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    example: 'Payoneer USD',
    description: 'Plataforma o medio de destino (receptor de la comisión).',
  })
  @IsString()
  to: string;

  @ApiProperty({
    example: 'PayPal USD',
    description: 'Plataforma o medio de origen (emisor del monto).',
  })
  @IsString()
  from: string;
}

