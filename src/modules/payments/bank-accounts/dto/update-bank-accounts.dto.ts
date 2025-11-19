import { IsOptional, IsString, Length, IsBoolean } from 'class-validator';

export class UpdateBankAccountDto {
  @IsOptional()
  @IsString()
  holder_name?: string;

  @IsOptional()
  @IsString()
  document_type?: string;

  @IsOptional()
  @IsString()
  document_value?: string;

  @IsOptional()
  @IsString()
  bank_name?: string;

  @IsOptional()
  @IsString()
  account_number?: string;

  @IsOptional()
  @IsString()
  iban?: string;

  @IsOptional()
  @IsString()
  swift?: string;

  @IsOptional()
  @IsString()
  @Length(2, 3)
  currency?: string;

  @IsOptional()
  @IsString()
  owner_type?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsString()
  payment_provider_id?: string;
}
