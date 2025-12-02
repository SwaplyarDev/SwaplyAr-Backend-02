import { CreateAmountDto } from '@transactions/amounts/dto/create-amount.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, ValidateNested, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransactionDto {
  @ApiProperty({
    name: 'countryTransaction',
    description: 'País donde se realiza la transacción',
    example: 'Argentina',
  })
  @IsString()
  @IsNotEmpty()
  countryTransaction: string;

  @ApiProperty({
    name: 'message',
    description: 'Mensaje o descripción de la transacción',
    example: 'Transferencia de prueba',
    required: false,
  })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({
    name: 'senderAccountId',
    description: 'ID de la cuenta financiera emisora',
    example: 'c0f7a63e-4e49-4e91-b889-4e7e7f81a3f3',
  })
  @IsUUID()
  @IsNotEmpty()
  senderAccountId: string;

  @ApiProperty({
    name: 'financialAccountId',
    description: 'ID de la cuenta financiera receptora',
    example: 'bb2e82a3-12de-4ff1-8a0d-90c0fcd403a4',
  })
  @IsUUID()
  @IsNotEmpty()
  financialAccountId: string;

  @ApiProperty({
    name: 'amount',
    description: 'Detalle del monto de la transacción',
    type: CreateAmountDto,
  })
  @ValidateNested()
  @Type(() => CreateAmountDto)
  @IsNotEmpty()
  amount: CreateAmountDto;

  @ApiProperty({
    name: 'userDiscountIds',
    description: 'IDs de descuentos aplicables a la transacción',
    example: ['550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsUUID('4', { each: true })
  userDiscountIds?: string[];
}
