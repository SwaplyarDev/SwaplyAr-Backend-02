/*import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStarDto {
  @ApiProperty({
    description: 'Monto de la transacción a añadir a las recompensas',
  })
  @IsInt()
  @Min(1)
  quantity: number;
  transactionId: string;
}*/

import { IsInt, Min, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateStarDto {
  @ApiProperty({
    description: 'Monto de la transacción a añadir a las recompensas',
    example: 100, 
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Id de la transacción asociada',
    example: 'vzGua5nfRo',   
  })
  @IsString()
  transactionId: string;
}
