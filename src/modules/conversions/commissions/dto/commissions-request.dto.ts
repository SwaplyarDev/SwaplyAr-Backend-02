import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsUUID } from 'class-validator';

export class CommissionRequestDto {
  @ApiProperty({
    example: 85.39001438,
    description: 'Monto base sobre el que calcular la comisión.',
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Id de plataforma o medio de destino (receptor de la comisión).',
  })
  @IsUUID()
  toPlatformId: string;

  @ApiProperty({
    description: 'Id de plataforma o medio de origen (emisor del monto).',
  })
  @IsUUID()
  fromPlatformId: string;
}
