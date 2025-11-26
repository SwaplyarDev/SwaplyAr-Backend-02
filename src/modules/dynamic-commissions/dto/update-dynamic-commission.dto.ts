import { ApiProperty } from '@nestjs/swagger';
import { PlatformName } from 'src/enum/commissions.enum';
import { IsEnum, IsNumber, Min, Max } from 'class-validator';

export class UpdateDynamicCommissionDto {
  @ApiProperty({
    enum: PlatformName,
    enumName: 'PlatformName',
    example: PlatformName.PAYPAL_USD,
    description: 'Plataforma de origen (valor válido del enum PlatformName)',
  })
  @IsEnum(PlatformName, {
    message:
      'La plataforma debe ser un valor válido del enum PlatformName. Valores permitidos:  Banco ARS, pix BRL, PayPal USD, Payoneer EUR, Payoneer USD, wise EUR, wise USD, tether USD.',
  })
  fromPlatform: PlatformName;

  @ApiProperty({
    enum: PlatformName,
    enumName: 'PlatformName',
    example: PlatformName.PAYONEER_EUR,
    description: 'Plataforma de destino (valor válido del enum PlatformName)',
  })
  @IsEnum(PlatformName, {
    message:
      'La plataforma debe ser un valor válido del enum PlatformName. Valores permitidos:  Banco ARS, pix BRL, PayPal USD, Payoneer EUR, Payoneer USD, wise EUR, wise USD, tether USD.',
  })
  toPlatform: PlatformName;

  @ApiProperty({
    example: 0.14,
    description: 'Nuevo valor de la comisión (entre -1 y 1)',
  })
  @IsNumber({}, { message: 'commissionRate debe ser un número' })
  @Min(-1, { message: 'commissionRate no puede ser menor que -1' })
  @Max(1, { message: 'commissionRate no puede ser mayor que 1' })
  commissionRate: number;
}
