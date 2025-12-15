import { CreateAmountDto } from '@transactions/amounts/dto/create-amount.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, ValidateNested, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSenderFinancialAccountDto } from 'src/modules/payments/sender-accounts/dto/create-sender-financial-account.dto';
import { CreateFinancialAccountDto } from 'src/modules/payments/financial-accounts/dto/create-financial-accounts.dto';

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

  @ApiProperty({ type: CreateSenderFinancialAccountDto })
  senderAccount: CreateSenderFinancialAccountDto;

  @ApiProperty({ type: CreateFinancialAccountDto })
  financialAccounts: CreateFinancialAccountDto;

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
