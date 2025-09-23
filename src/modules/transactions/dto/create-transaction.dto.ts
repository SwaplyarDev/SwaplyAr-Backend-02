import { CreateAmountDto } from '@transactions/amounts/dto/create-amount.dto';
import { CreateFinancialAccountDto } from './../../financial-accounts/dto/create-financial-accounts.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, ValidateNested, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransactionDto {
  @ApiProperty({
    name: 'countryTransaction',
    description: 'País donde se realiza la transacción',
    example: 'Argentina',
  })
  @IsString({ message: 'countryTransaction debe ser un texto' })
  @IsNotEmpty({ message: 'countryTransaction es obligatorio' })
  countryTransaction: string;

  @ApiProperty({
    name: 'message',
    description: 'Mensaje o descripción de la transacción',
    example: 'Transferencia de prueba',
  })
  @IsString({ message: 'message debe ser un texto' })
  @IsOptional({ message: 'message es opcional' })
  message: string;

  @ApiProperty({
    name: 'financialAccounts',
    description: 'Datos de las cuentas financieras (emisor y receptor)',
    type: CreateFinancialAccountDto,
  })
  @ValidateNested({ message: 'financialAccounts debe ser un objeto válido' })
  @Type(() => CreateFinancialAccountDto)
  @IsNotEmpty({ message: 'financialAccounts es obligatorio' })
  financialAccounts: CreateFinancialAccountDto;

  @ApiProperty({
    name: 'amount',
    description: 'Detalle de los montos involucrados en la transacción',
    type: CreateAmountDto,
  })
  @ValidateNested({ message: 'amount debe ser un objeto válido' })
  @Type(() => CreateAmountDto)
  @IsNotEmpty({ message: 'amount es obligatorio' })
  amount: CreateAmountDto;

  @ApiProperty ({

    name: 'userDiscountId',
    description: 'Identificador del descuento aplicado a la transacción',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,

  })

  @IsOptional ()
  @IsUUID ('4', { message: 'userDiscountId debe ser un UUID válido' })
  userDiscountId?: string;

  @ApiProperty ({

    name: 'userDiscountIds',
    description: 'Array de identificadores de descuentos aplicables a la transacción (opcional)',
    example: ['550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001'],
    required: false,
    type: [String],

  })

  @IsOptional ()
  @IsUUID ('4', { each: true, message: 'Cada userDiscountId debe ser un UUID válido' })
  userDiscountIds?: string [];

}
