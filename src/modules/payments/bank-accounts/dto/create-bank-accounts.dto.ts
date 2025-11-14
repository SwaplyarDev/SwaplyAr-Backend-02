import { IsUUID, IsString, IsOptional, IsBoolean, Length, MaxLength } from 'class-validator';

export class CreateBankAccountDto {
  @IsUUID()
  user_id: string;

  @IsUUID()
  payment_provider_id: string;

  @IsString()
  @MaxLength(150)
  holder_name: string;

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
  @MaxLength(20)
  owner_type?: string;

  @IsUUID()
  created_by_id: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
