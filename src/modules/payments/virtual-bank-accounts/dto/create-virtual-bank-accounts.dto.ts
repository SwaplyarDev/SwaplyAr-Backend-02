import { IsUUID, IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateVirtualBankAccountDto {
  @IsUUID()
  user_id: string;

  @IsUUID()
  payment_provider_id: string;

  @IsEmail()
  email_account: string;

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

  @IsUUID()
  created_by_id: string;
}
