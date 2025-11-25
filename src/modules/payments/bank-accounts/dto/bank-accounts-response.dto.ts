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

  @ApiPropertyOptional()
  @Expose()
  currency?: string;

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
