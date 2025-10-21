import { ApiProperty } from '@nestjs/swagger';
import { PlatformName } from 'src/enum/commissions.enum';

export class DynamicCommissionResponseDto {
  @ApiProperty({
    example: '65f445d9-e7dc-4113-975d-d56b11456bc6',
    description: 'Identificador único de la comisión',
  })
  id: string;

  @ApiProperty({
    enum: PlatformName,
    enumName: 'PlatformName',
    example: PlatformName.PAYPAL_USD,
    description: 'Plataforma de origen (valor válido del enum PlatformName)',
  })
  fromPlatform: PlatformName;

  @ApiProperty({
    enum: PlatformName,
    enumName: 'PlatformName',
    example: PlatformName.PAYONEER_EUR,
    description: 'Plataforma de destino (valor válido del enum PlatformName)',
  })
  toPlatform: PlatformName;

  @ApiProperty({
    example: 0.14,
    description: 'Tasa de comisión aplicada entre las plataformas (0 a 1)',
  })
  commissionRate: number;

  @ApiProperty({
    example: '2025-10-13T21:51:03.875Z',
    description: 'Fecha de creación del registro',
  })
  createdAt: string;

  @ApiProperty({
    example: '2025-10-13T21:53:03.875Z',
    description: 'Última fecha de actualización del registro',
  })
  updatedAt: string;
}
