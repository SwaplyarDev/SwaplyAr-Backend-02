import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsPositive } from 'class-validator';

export class ConversionRequestDto {
  @ApiProperty({ example: 'USD', description: 'Código de la divisa o moneda origen' })
  @IsString()
  from: string;
  @ApiProperty({ example: 'EUR', description: 'Código de la divisa o moneda destino' })
  @IsString()
  to: string;

  @ApiProperty({ example: 100, description: 'Cantidad a convertir' })
  @IsNumber()
  @IsPositive()
  amount: number;
}
