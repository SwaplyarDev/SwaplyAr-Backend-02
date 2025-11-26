import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUUID,
  IsString,
  IsOptional,
  IsBoolean,
  Length,
  MaxLength,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBankAccountDetailDto {
  @ApiProperty()
  @IsString()
  fieldKey: string;

  @ApiProperty()
  @IsString()
  fieldLabel: string;

  @ApiProperty()
  @IsString()
  fieldValue: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isEncrypted?: boolean;
}

export class CreateBankAccountDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty()
  @IsUUID()
  paymentProviderId: string;

  @ApiProperty()
  @IsString()
  @Length(3, 3)
  countryCode: string;

  @ApiProperty()
  @IsString()
  @MaxLength(150)
  holderName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  documentType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  documentValue?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  accountNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  iban?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  swift?: string;
  @IsOptional()
  @IsString()
  @Length(2, 3)
  currency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  ownerType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ type: [CreateBankAccountDetailDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBankAccountDetailDto)
  details?: CreateBankAccountDetailDto[];
}
