import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class BankAccountDetailResponseDto {
  @ApiProperty()
  @Expose()
  fieldKey: string;

  @ApiProperty()
  @Expose()
  fieldLabel: string;

  @ApiProperty()
  @Expose()
  fieldValue: string;

  @ApiProperty()
  @Expose()
  isEncrypted: boolean;
}

export class CurrencyResponseDto {
  @ApiProperty()
  @Expose()
  currencyId: string;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  symbol: string;
}

export class BankAccountResponseDto {
  @ApiProperty()
  @Expose()
  bankAccountId: string;

  @ApiProperty()
  @Expose()
  userId: string;

  @ApiProperty()
  @Expose()
  paymentProviderId: string;

  @ApiProperty()
  @Expose()
  countryCode: string;

  @ApiProperty()
  @Expose()
  holderName: string;

  @ApiPropertyOptional()
  @Expose()
  documentType?: string;

  @ApiPropertyOptional()
  @Expose()
  documentValue?: string;

  @ApiPropertyOptional()
  @Expose()
  bankName?: string;

  @ApiPropertyOptional()
  @Expose()
  accountNumber?: string;

  @ApiPropertyOptional()
  @Expose()
  iban?: string;

  @ApiPropertyOptional()
  @Expose()
  swift?: string;

  @ApiPropertyOptional({ type: () => CurrencyResponseDto })
  @Expose()
  @Type(() => CurrencyResponseDto)
  currency?: CurrencyResponseDto;

  @ApiProperty()
  @Expose()
  ownerType: string;

  @ApiProperty()
  @Expose()
  isActive: boolean;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  createdById: string;

  @ApiPropertyOptional({ type: [BankAccountDetailResponseDto] })
  @Expose()
  @Type(() => BankAccountDetailResponseDto)
  details?: BankAccountDetailResponseDto[];
}
