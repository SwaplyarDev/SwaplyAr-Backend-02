import { CreateAmountDto } from '@transactions/amounts/dto/create-amount.dto';
import { CreateFinancialAccountDto } from './../../financial-accounts/dto/create-financial-accounts.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransactionDto {
  @ApiProperty({
    name: 'paymentsId',
    description: 'ID único del pago o transacción',
    example: '123',
  })
  @IsString()
  paymentsId: string;

  @ApiProperty({
    name: 'countryTransaction',
    description: 'País donde se realiza la transacción',
    example: 'Argentina',
  })
  @IsString()
  countryTransaction: string;

  @ApiProperty({
    name: 'message',
    description: 'Mensaje o descripción de la transacción',
    example: 'Transferencia de prueba',
  })
  @IsString()
  message: string;

  @ApiProperty({
    name: 'financialAccounts',
    description: 'Datos de las cuentas financieras (emisor y receptor)',
    type: CreateFinancialAccountDto,
    example: {
      senderAccount: {
        firstName: 'Juan',
        lastName: 'Pérez',
        phoneNumber: '12456789',
        createdBy: 'fernandeezalan20@gmail.com',
        paymentMethod: {
          platformId: 'bank',
          method: 'bank',
        },
      },
      receiverAccount: {
        firstName: 'Ana',
        lastName: 'García',
        document_value: '12345678',
        phoneNumber: '1122334455',
        email: 'brasil@swaplyar.com',
        bank_name: 'Banco Galicia',
        paymentMethod: {
          platformId: 'bank',
          method: 'bank',
          bank: {
            currency: 'ARS',
            bankName: 'Banco Galicia',
            sendMethodKey: 'CBU',
            sendMethodValue: '1234567890123456789012',
            documentType: 'DNI',
            documentValue: '12345678',
          },
        },
      },
    },
  })
  @ValidateNested()
  @Type(() => CreateFinancialAccountDto)
  financialAccounts: CreateFinancialAccountDto;

  @ApiProperty({
    name: 'amount',
    description: 'Detalle de los montos involucrados en la transacción',
    type: CreateAmountDto,
    example: {
      amountSent: 1000,
      currencySent: 'ARS',
      amountReceived: 900,
      currencyReceived: 'BRL',
      received: false,
    },
  })
  @ValidateNested()
  @Type(() => CreateAmountDto)
  amount: CreateAmountDto;
}
