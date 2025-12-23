import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max, IsUUID } from 'class-validator';

export class CreateDynamicCommissionDto {
  @ApiProperty({
    description: 'Id de plataforma origen',
  })
  @IsUUID()
  fromPlatformId: string;

  @ApiProperty({
    description: 'Id de plataforma destino',
  })
  @IsUUID()
  toPlatformId: string;

  @ApiProperty({
    description: 'Porcentaje de comisión entre -1 y 1',
    example: 0.14,
  })
  @IsNumber({}, { message: 'commissionRate debe ser un número' })
  @Min(-1, { message: 'commissionRate no puede ser menor que -1' })
  @Max(1, { message: 'commissionRate no puede ser mayor que 1' })
  commissionRate: number;
}
