import { ApiProperty } from '@nestjs/swagger';

export class DynamicCommissionResponseDto {
  @ApiProperty({
    example: '65f445d9-e7dc-4113-975d-d56b11456bc6',
    description: 'Identificador único de la comisión',
  })
  id: string;

  @ApiProperty({
    description: 'Id de plataforma de origen',
  })
  fromPlatformId: string;

  @ApiProperty({
    description: 'Id de plataforma de destino',
  })
  toPlatformId: string;

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
