import { FinancialAccountResponseDto } from '@financial-accounts/dto/financial-accounts-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { NoteResponseDto } from '@transactions/notes/dto/note-response.dto';
import { RegretDto } from '@transactions/regrets/dto/regret-response-dto';
import { Expose, Transform, Type } from 'class-transformer';

export class ProofOfPaymentResponseDto {
  @Expose()
  @ApiProperty({ name: 'id', example: '6d238f0a-3eab-4dc2-94cb-c9a833261a55' })
  id: string;

  @Expose()
  @ApiProperty({
    name: 'imgUrl',
    example:
      'https://res.cloudinary.com/dy1jiclwg/image/upload/v1754923889/proof-of-payments/proofOfPayment_3_mdvm8d.png_1754923888954.png',
  })
  imgUrl: string;

  @Expose()
  @ApiProperty({ name: 'createAt', example: '2025-08-11T14:51:29.944Z' })
  createAt: string;
}

export class SenderAccountDto {}

export class AmountResponseDto {
  @ApiProperty({ name: 'id', example: 'ba1196da-7e71-4710-8f44-2df28a31875e' })
  id: string;

  @Expose()
  @ApiProperty({ name: 'amountSent', example: 1000 })
  amountSent: string;

  @Expose()
  @ApiProperty({ name: 'currencySent', example: 'ARS' })
  currencySent: string;

  @Expose()
  @ApiProperty({ name: 'amountReceived', example: 900 })
  amountReceived: string;

  @Expose()
  @ApiProperty({ name: 'currencyReceived', example: 'BRL' })
  currencyReceived: string;

  @ApiProperty({ name: 'received', example: false })
  received: boolean;
}

export class TransactionResponseDto {
  @Expose()
  id: string;

  @Expose()
  countryTransaction: string;

  @Expose()
  message: string;

  @Expose()
  finalStatus: string;

  @Expose()
  isNoteVerified: boolean;

  @Expose()
  noteVerificationExpiresAt?: Date;

  @Expose()
  @Type(() => SenderAccountDto)
  senderAccount: SenderAccountDto;

  @Expose()
  @Type(() => FinancialAccountResponseDto)
  financialAccounts: FinancialAccountResponseDto;

  @Expose()
  @Type(() => NoteResponseDto)
  note?: NoteResponseDto;

  @Expose()
  @Type(() => RegretDto)
  regret?: RegretDto;

  @Expose()
  @Type(() => ProofOfPaymentResponseDto)
  proofsOfPayment: ProofOfPaymentResponseDto[];

  @Expose()
  @Type(() => AmountResponseDto)
  amount: AmountResponseDto;

  @Expose()
  amountValue?: string;

  @Expose()
  amountCurrency?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Transform(({ obj }) =>
    obj.transactionUserDiscounts?.map((tud) => tud.userDiscount.id) ?? []
  )
  userDiscounts: string[];
}


export class UserDiscountGetDto {
  @Expose()
  @ApiProperty({ example: 'uuid-discount-1234' })
  id: string;

  @Expose()
  @ApiProperty({ example: 'WELCOME-TT8U49' })
  code: string;

  @Expose()
  @ApiProperty({ example: 5 })
  value: number;

  @Expose()
  @ApiProperty({ example: '2025-09-17T14:32:00.000Z', required: false })
  usedAt?: Date | null;
}

export class TransactionGetByIdDto {
  @Expose()
  id: string;

  @Expose()
  countryTransaction: string;

  @Expose()
  message: string;

  @Expose()
  createdAt: string;

  @Expose()
  finalStatus: string;

  @Expose()
  @Type(() => AccountSenderDto)
  senderAccount: AccountSenderDto;

  @Expose()
  @Type(() => AccountReceiverDto)
  financialAccounts: AccountReceiverDto;

  @Expose()
  @Type(() => ProofOfPaymentResponseDto)
  proofsOfPayment: ProofOfPaymentResponseDto[];

  @Expose()
  @Type(() => AmountResponseDto)
  amount: AmountResponseDto;

  @Expose()
  @Type(() => RegretDto)
  regret?: RegretDto;

  @Expose()
  isNoteVerified: boolean;

  @Expose()
  @ApiProperty({
    description: 'Lista completa de descuentos aplicados',
  })
  userDiscounts?: UserDiscountGetDto[];
}

export class ProofOfPaymentDto {
  @ApiProperty({ example: '6d238f0a-3eab-4dc2-94cb-c9a833261a55' })
  id: string;

  @ApiProperty({
    example: 'https://res.cloudinary.com/dy1jiclwg/image/upload/...png',
  })
  imgUrl: string;
}

export class AmountDto {
  @ApiProperty({ example: 'ba1196da-7e71-4710-8f44-2df28a31875e' })
  id: string;

  @ApiProperty({ example: 1000 })
  amountSent: number;

  @ApiProperty({ example: 'ARS' })
  currencySent: string;

  @ApiProperty({ example: 900 })
  amountReceived: number;

  @ApiProperty({ example: 'BRL' })
  currencyReceived: string;

  @ApiProperty({ example: false })
  isReceived: string;

  @ApiProperty({ example: '2025-08-11T14:51:29.944Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-08-11T14:51:29.944Z' })
  updatedAt: Date;
}

export class TransactionGetResponseDto {
  @ApiProperty({ example: 'Sq5k0DMwf4' })
  id: string;

  @ApiProperty({ example: '2025-08-11T14:51:28.841Z' })
  createdAt: string;

  @ApiProperty({ example: 'pending' })
  finalStatus: string;

  @ApiProperty({ example: 'c7a0e81d-2a49-4d09-8120-6f02d63e1f01', nullable: true })
  regretId?: string | null;

  @ApiProperty({ type: SenderAccountDto })
  senderAccount: SenderAccountDto;

  @ApiProperty({ type: ProofOfPaymentDto, required: false })
  proofsOfPayment?: ProofOfPaymentDto[];

  @ApiProperty({ type: AmountDto })
  amount: AmountDto;
}
