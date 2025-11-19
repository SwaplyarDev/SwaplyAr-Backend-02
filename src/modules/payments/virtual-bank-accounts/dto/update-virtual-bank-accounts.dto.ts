import { IsOptional, IsString, IsUUID, IsBoolean, Length } from 'class-validator';

export class UpdateVirtualBankAccountDto {
  @IsOptional()
  @IsUUID()
  user_id?: string;

  @IsOptional()
  @IsUUID()
  payment_provider_id?: string;

  @IsOptional()
  @IsString()
  email_account?: string;

  @IsOptional()
  @IsString()
  account_alias?: string;

  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string;

  @IsOptional()
  @IsString()
  owner_type?: string;

  @IsOptional()
  @IsUUID()
  created_by_id?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
