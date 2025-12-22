import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID } from 'class-validator';

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

  @ApiProperty({ description: 'Id de plataforma de origen' })
  @IsUUID()
  fromPlatformId: string;

  @ApiProperty({ description: 'Id de plataforma de destino', example: 'Payoneer EUR' })
  @IsUUID()
  toPlatformId: string;
}
