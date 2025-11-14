import { ApiProperty } from '@nestjs/swagger';

export class PaymentMethodDataDto {
  @ApiProperty({ example: 'af2927b8-c901-4bc9-93fe-5f1cf58a516e' })
  id: string;

  @ApiProperty({ example: 'bank' })
  platformId: string;

  @ApiProperty({ example: 'bank' })
  method: string;

  @ApiProperty({ example: 'ARS' })
  currency: string;

  @ApiProperty({ example: 'Banco Nación' })
  bankName: string;

  @ApiProperty({ example: 'CBU' })
  sendMethodKey: string;

  @ApiProperty({ example: '1234567890123456789012' })
  sendMethodValue: string;

  @ApiProperty({ example: 'DNI' })
  documentType: string;

  @ApiProperty({ example: '47654321' })
  documentValue: string;
}

export class FinancialAccountDataDto {
  @ApiProperty({ example: 'a8fcf65d-1cfc-4100-b5be-ce5c014520bf' })
  id: string;

  @ApiProperty({ example: 'Juan' })
  firstName: string;

  @ApiProperty({ example: 'Pérez' })
  lastName: string;

  @ApiProperty({ type: PaymentMethodDataDto })
  paymentMethod: PaymentMethodDataDto;
}

export class BankDataDto {
  @ApiProperty({ example: '29e11aa2-4f5f-45c4-aac9-52da305c5313' })
  accountId: string;

  @ApiProperty({ example: 'Cuenta Principal' })
  accountName: string;

  @ApiProperty({ example: '2025-09-19T14:06:28.075Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-09-19T14:06:28.113Z' })
  updatedAt: Date;

  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({ example: 'e98d5deb-02f5-4466-8aaa-0ae638836422' })
  userId: string;

  @ApiProperty({ type: FinancialAccountDataDto })
  financialAccount: FinancialAccountDataDto;
}

export class CreateFinancialAccountResponseDto {
  @ApiProperty({ example: 'Cuenta financiera creada correctamente' })
  message: string;

  @ApiProperty({ type: BankDataDto })
  bank: BankDataDto;
}
