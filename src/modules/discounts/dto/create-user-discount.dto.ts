import { IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDiscountDto {
  @ApiProperty({ description: 'ID del usuario que recibe el descuento' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'ID del código de descuento existente' })
  @IsUUID()
  discountCodeId: string;

  @ApiProperty({
    description: 'ID de la transacción (opcional)',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  transactionId?: string;
}