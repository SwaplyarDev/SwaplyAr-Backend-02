import { ApiProperty } from '@nestjs/swagger';

export class PaymentMethodDataDto {
  @ApiProperty({ example: 'PIX' })
  type: string;
}

export class SenderAccountDataDto {
  @ApiProperty({ example: 'uuid-sender' })
  id: string;

  @ApiProperty({ example: 'sender@mail.com' })
  email: string;
}

export class ReceiverAccountDataDto {
  @ApiProperty({ example: 'uuid-receiver' })
  id: string;

  @ApiProperty({ example: 'receiver@mail.com' })
  email: string;

  @ApiProperty({ type: PaymentMethodDataDto })
  paymentMethod: PaymentMethodDataDto;
}

export class TransactionDataDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 50000 })
  amount: number;

  @ApiProperty({ example: 'COP' })
  currency: string;

  @ApiProperty({ type: SenderAccountDataDto })
  senderAccount: SenderAccountDataDto;

  @ApiProperty({ type: ReceiverAccountDataDto })
  receiverAccount: ReceiverAccountDataDto;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  createdAt: Date;
}

export class ValidateOTPCodeResponseDto {
  @ApiProperty({ type: TransactionDataDto })
  transaction: TransactionDataDto;
}
