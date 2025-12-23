import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max, IsUUID } from 'class-validator';

export class UpdateDynamicCommissionDto {
  @ApiProperty({
    description: 'Id de plataforma de origen',
  })
  @IsUUID()
  fromPlatformId: string;

  @ApiProperty({
    description: 'Id de plataforma de destino',
  })
  @IsUUID()
  toPlatformId: string;

  @ApiProperty({
    example: 0.14,
    description: 'Nuevo valor de la comisión (entre -1 y 1)',
  })
  @IsNumber({}, { message: 'commissionRate debe ser un número' })
  @Min(-1, { message: 'commissionRate no puede ser menor que -1' })
  @Max(1, { message: 'commissionRate no puede ser mayor que 1' })
  commissionRate: number;
}
