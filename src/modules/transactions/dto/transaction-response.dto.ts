import { ApiProperty } from '@nestjs/swagger';
import { RegretDto } from '@transactions/regrets/dto/regret-response-dto';
import { Regret } from '@transactions/regrets/entities/regrets.entity';
import { Expose, Type } from 'class-transformer';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class PaymentMethodSenderDto {
  @Expose()
  @ApiProperty({ name: 'id', example: '75e91e4b-a6dd-43b8-a386-0bf5a336957b' })
  id: string;

  @Expose()
  @ApiProperty({ name: 'platformId', example: 'bank' })
  platformId: string;

  @Expose()
  @ApiProperty({ name: 'method', example: 'bank' })
  method: string;
}

export class PaymentMethodReceiverDto {
  @Expose()
  @ApiProperty({ name: 'id', example: '75e91e4b-a6dd-43b8-a386-0bf5a336957b' })
  id: string;

  @Expose()
  @ApiProperty({ name: 'platformId', example: 'bank' })
  platformId: string;

  @Expose()
  @ApiProperty({ name: 'method', example: 'bank' })
  method: string;

  @Expose()
  @ApiProperty({ name: 'currency', example: 'ARS', required: false })
  currency?: string;

  @Expose()
  @ApiProperty({ name: 'bankName', example: 'Banco Galicia', required: false })
  bankName?: string;

  @Expose()
  @ApiProperty({ name: 'sendMethodKey', example: 'CBU', required: false })
  sendMethodKey?: string;

  @Expose()
  @ApiProperty({ name: 'sendMethodValue', example: '1234567890123456789012', required: false })
  sendMethodValue?: string;

  @Expose()
  @ApiProperty({ name: 'documentType', example: 'DNI', required: false })
  documentType?: string;

  @Expose()
  @ApiProperty({ name: 'documentValue', example: '12345678', required: false })
  documentValue?: string;

  @Expose()
  @ApiProperty({ description: 'ID del banco virtual (PIX)', example: '123', required: false })
  pixId?: string;

  @Expose()
  @ApiProperty({ description: 'Clave del PIX', example: '123', required: false })
  pixKey?: string;

  @Expose()
  @ApiProperty({ description: 'Valor del PIX', example: '123', required: false })
  pixValue?: string;

  @Expose()
  @ApiProperty({ description: 'CPF (PIX)', example: '123', required: false })
  cpf?: string;

  @Expose()
  @ApiProperty({ description: 'Red (Crypto)', example: 'Ethereum', required: false })
  network?: string;

  @Expose()
  @ApiProperty({ description: 'Wallet (Crypto)', example: '0x123...', required: false })
  wallet?: string;

  @Expose()
  @ApiProperty({
    description: 'Email de la cuenta (Virtual Bank)',
    example: 'nahuel@gmail.com',
    required: false,
  })
  emailAccount?: string;

  @Expose()
  @ApiProperty({
    description: 'Código de transferencia (Virtual Bank)',
    example: '123',
    required: false,
  })
  transferCode?: string;
}

export class AccountSenderDto {
  @Expose()
  @ApiProperty({ name: 'id', example: '47964345-930b-4eec-b221-42ad423ac760' })
  id: string;

  @Expose()
  @ApiProperty({ name: 'firstName', example: 'Juan' })
  firstName: string;

  @Expose()
  @ApiProperty({ name: 'lastName', example: 'Pérez' })
  lastName: string;

  @Expose()
  @ApiProperty({ name: 'phoneNumber', example: '12456789' })
  phoneNumber: string;

  @Expose()
  @ApiProperty({ name: 'createdBy', example: 'coronajonhatan@gmail.com' })
  createdBy: string;

  @Expose()
  @Type(() => PaymentMethodSenderDto)
  @ApiProperty({ name: 'paymentMethod', type: PaymentMethodSenderDto })
  paymentMethod: PaymentMethodSenderDto;
}

export class AccountReceiverDto {
  @Expose()
  @ApiProperty({ name: 'id', example: 'e28f2e9f-b436-42cf-888c-c161739c8565' })
  id: string;

  @Expose()
  @Type(() => PaymentMethodReceiverDto)
  @ApiProperty({ name: 'paymentMethod', type: PaymentMethodReceiverDto })
  paymentMethod: PaymentMethodReceiverDto;
}

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

export class AmountResponseDto {
  @Expose()
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

  @Expose()
  @ApiProperty({ name: 'received', example: false })
  received: boolean;
}

export class TransactionResponseDto {
  @Expose()
  @ApiProperty({ name: 'id', example: 'Sq5k0DMwf4' })
  id: string;

  @Expose()
  @ApiProperty({ name: 'countryTransaction', example: 'Argentina' })
  countryTransaction: string;

  @Expose()
  @ApiProperty({ name: 'message', example: 'Transferencia de prueba' })
  message: string;

  @Expose()
  @ApiProperty({ name: 'createdAt', example: '2025-08-11T14:51:28.841Z' })
  createdAt: string;

  @Expose()
  @ApiProperty({ name: 'finalStatus', example: 'pending' })
  finalStatus: string;

  @Expose()
  @Type(() => RegretDto)
  @ApiProperty({ type: RegretDto, required: false })
  regret?: RegretDto;

  @Expose()
  @ApiProperty({ example: null })
  regretId?: string | null;

  @Expose()
  @Type(() => AccountSenderDto)
  @ApiProperty({ name: 'senderAccount', type: AccountSenderDto })
  senderAccount: AccountSenderDto;

  @Expose()
  @Type(() => AccountReceiverDto)
  @ApiProperty({ name: 'receiverAccount', type: AccountReceiverDto })
  receiverAccount: AccountReceiverDto;

  @Expose()
  @Type(() => ProofOfPaymentResponseDto)
  @ApiProperty({ name: 'proofOfPayment', type: ProofOfPaymentResponseDto })
  proofOfPayment: ProofOfPaymentResponseDto;

  @Expose()
  @Type(() => AmountResponseDto)
  @ApiProperty({ name: 'amount', type: AmountResponseDto })
  amount: AmountResponseDto;
}

export class TransactionGetByIdDto extends TransactionResponseDto {
  @Expose()
  @ApiProperty({ example: false })
  isNoteVerified: boolean;
}

export class PaymentMethodGetReceiverDto {
  // Bank
  @ApiProperty({
    description: 'ID del método de pago (Bank)',
    example: '75e91e4b-a6dd-43b8-a386-0bf5a336957b',
    required: false,
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
    description: 'ID de la plataforma (Bank)',
    example: 'bank',
    required: false,
  })
  @IsOptional()
  @IsString()
  platformId?: string;

  @ApiProperty({
    description: 'Método (Bank, PIX, Crypto, VirtualBank)',
    example: 'bank',
    required: false,
  })
  @IsOptional()
  @IsString()
  method?: string;

  @ApiProperty({
    description: 'Moneda (Bank, Crypto, VirtualBank)',
    example: 'ARS',
    required: false,
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({
    description: 'Nombre del banco (Bank)',
    example: 'Banco Galicia',
    required: false,
  })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiProperty({
    description: 'Clave de envío (CBU, alias, PIX)',
    example: 'CBU',
    required: false,
  })
  @IsOptional()
  @IsString()
  sendMethodKey?: string;

  @ApiProperty({
    description: 'Valor de la clave de envío',
    example: '1234567890123456789012',
    required: false,
  })
  @IsOptional()
  @IsString()
  sendMethodValue?: string;

  // PIX
  @ApiProperty({
    description: 'ID del banco virtual (PIX)',
    example: '123',
    required: false,
  })
  @IsOptional()
  @IsString()
  pixId?: string;

  @ApiProperty({
    description: 'Clave del PIX',
    example: '123',
    required: false,
  })
  @IsOptional()
  @IsString()
  pixKey?: string;

  @ApiProperty({
    description: 'Valor del PIX',
    example: '123',
    required: false,
  })
  @IsOptional()
  @IsString()
  pixValue?: string;

  @ApiProperty({ description: 'CPF (PIX)', example: '123', required: false })
  @IsOptional()
  @IsString()
  cpf?: string;

  // Crypto
  @ApiProperty({
    description: 'Red (Crypto)',
    example: 'Ethereum',
    required: false,
  })
  @IsOptional()
  @IsString()
  network?: string;

  @ApiProperty({
    description: 'Wallet (Crypto)',
    example: '0x123...',
    required: false,
  })
  @IsOptional()
  @IsString()
  wallet?: string;

  // Virtual Bank
  @ApiProperty({
    description: 'Email de la cuenta (Virtual Bank)',
    example: 'nahuel@gmail.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  emailAccount?: string;

  @ApiProperty({
    description: 'Código de transferencia (Virtual Bank)',
    example: '123',
    required: false,
  })
  @IsOptional()
  @IsString()
  transferCode?: string;
}

export class SenderAccountDto {
  @ApiProperty({ example: '47964345-930b-4eec-b221-42ad423ac760' })
  id: string;

  @ApiProperty({ example: 'Juan' })
  firstName: string;

  @ApiProperty({ example: 'Pérez' })
  lastName: string;

  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail()
  createdBy: string;

  @ApiProperty({ example: 'Pérez' })
  phoneNumber: string;

  @ApiProperty({ type: PaymentMethodSenderDto })
  paymentMethod: PaymentMethodSenderDto;
}

export class ReceiverAccountDto {
  @ApiProperty({ example: 'e28f2e9f-b436-42cf-888c-c161739c8565' })
  id: string;

  @ApiProperty({ type: PaymentMethodGetReceiverDto })
  paymentMethod: PaymentMethodGetReceiverDto;
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

  @ApiProperty({ type: ReceiverAccountDto })
  receiverAccount: ReceiverAccountDto;

  @ApiProperty({ type: ProofOfPaymentDto, required: false })
  proofOfPayment?: ProofOfPaymentDto;

  @ApiProperty({ type: AmountDto })
  amount: AmountDto;
}
