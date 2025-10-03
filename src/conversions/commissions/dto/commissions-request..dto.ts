

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString, IsOptional } from 'class-validator';

export class CommissionRequestDto {
  @ApiProperty({ example: 100, description: 'Monto base sobre el que calcular la comisión' })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    example: 'payoneer',
    description: 'Plataforma sobre la que se aplica la comisión (opcional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  platform?: string;
}
