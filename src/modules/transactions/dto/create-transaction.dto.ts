import { CreateAmountDto } from '@transactions/amounts/dto/create-amount.dto';
import { CreateFinancialAccountDto } from './../../financial-accounts/dto/create-financial-accounts.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({ description: 'ID de la transaccion', example: '123' })
  paymentsId: string;
  @ApiProperty({ description: 'Pais de la transaccion', example: 'Argentina' })
  countryTransaction: string;
  @ApiProperty({
    description: 'Mensaje de la transaccion',
    example: 'Transaccion de prueba',
  })
  message: string;
  @ApiProperty({
    description: 'Usuario que crea la transaccion',
    example: '123',
  })
  createdBy: string;
  @ApiProperty({
    description: 'Cuenta financiera de la transaccion',
    example: '123',
  })
  financialAccounts: CreateFinancialAccountDto;
  @ApiProperty({ description: 'Cantidad de la transaccion', example: '123' })
  amount: CreateAmountDto;
}
