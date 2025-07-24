import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDiscountDto {
  @ApiProperty({ description: 'ID de la transacción que utiliza el descuento' })
  @IsUUID()
  transactionId: string;
}