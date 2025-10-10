import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';
/*import { ArsOperationType } from '../../../enum/ars-operation-type.enum';*/

export class ConversionTotalRequestDto {
  @ApiProperty({ description: 'Monto a convertir', example: 100 })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Moneda de origen', example: 'USD' })
  @IsString()
  from: string;

  @ApiProperty({ description: 'Moneda de destino', example: 'EUR' })
  @IsString()
  to: string;

  @ApiProperty({ description: 'Plataforma de origen', example: 'PayPal USD' })
  @IsString()
  fromPlatform: string;

  @ApiProperty({ description: 'Plataforma de destino', example: 'Payoneer EUR' })
  @IsString()
  toPlatform: string;
}
