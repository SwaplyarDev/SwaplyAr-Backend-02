import { CreateAmountDto } from '@transactions/amounts/dto/create-amount.dto';
import { CreateFinancialAccountDto } from './../../financial-accounts/dto/create-financial-accounts.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransactionDto {
  @ApiProperty({
    name: 'paymentsId',
    description: 'ID único del pago o transacción',
    example: '123',
  })
  @IsString({ message: 'paymentsId debe ser un texto' })
  @IsNotEmpty({ message: 'paymentsId es obligatorio' })
  paymentsId: string;

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
}
