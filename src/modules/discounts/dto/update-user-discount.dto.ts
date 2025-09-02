import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDiscountDto {
  @ApiProperty({ description: 'ID de la transacción que utiliza el descuento' })
  @IsString()
  @MinLength(10, { message: 'El ID de la transacción debe tener al menos 10 caracteres.' })
  @MaxLength(10, { message: 'El ID de la transacción no puede exceder los 10 caracteres.' })
  transactionId: string;
}
