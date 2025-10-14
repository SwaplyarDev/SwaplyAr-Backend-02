

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, Min, Max, IsString } from 'class-validator';
import { PlatformName } from 'src/enum/commissions.enum';

export class CreateDynamicCommissionDto {
  @ApiProperty({
    enum: PlatformName,
    description: 'Plataforma origen',
    example: PlatformName.PAYPAL_USD,
  })
  @IsEnum(PlatformName, { message: 'La plataforma debe ser un valor válido del enum PlatformName. Valores permitidos:  Banco ARS, pix BRL, PayPal USD, Payoneer EUR, Payoneer USD, wise EUR, wise USD, tether USD.'  })
  fromPlatform: PlatformName;

  @ApiProperty({
    enum: PlatformName,
    description: 'Plataforma destino',
    example: PlatformName.PAYONEER_EUR,
  })
  @IsEnum(PlatformName, { message: 'La plataforma debe ser un valor válido del enum PlatformName. Valores permitidos:  Banco ARS, pix BRL, PayPal USD, Payoneer EUR, Payoneer USD, wise EUR, wise USD, tether USD.' })
  toPlatform: PlatformName;

  @ApiProperty({
    description: 'Porcentaje de comisión entre 0 y 1',
    example: 0.14,
  })
  @IsNumber({}, { message: 'commissionRate debe ser un número' })
  @Min(0, { message: 'commissionRate no puede ser menor que 0' })
  @Max(1, { message: 'commissionRate no puede ser mayor que 1' })
  commissionRate: number;
}






