import { IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDiscountDto {
  @ApiProperty({
    description:
      'ID de la transacción que utiliza el descuento (exactamente 10 caracteres alfanuméricos)',
    example: 'vzGua5nfRo',
  })
  @IsString({ message: 'transactionId debe ser un string' })
  @Length(10, 10, {
    message: 'transactionId debe tener exactamente 10 caracteres',
  })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'transactionId solo puede contener letras y números',
  })
  transactionId: string;
}
