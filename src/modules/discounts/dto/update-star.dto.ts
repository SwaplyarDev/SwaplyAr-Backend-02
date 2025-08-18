import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStarDto {
  @ApiProperty({
    description: 'Monto de la transacción a añadir a las recompensas',
  })
  @IsInt()
  @Min(1)
  quantity: number;
  transactionId: string;
}
