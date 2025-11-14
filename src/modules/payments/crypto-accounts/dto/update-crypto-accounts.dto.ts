import { IsOptional, IsString, IsUUID, IsBoolean } from 'class-validator';

export class UpdateCryptoAccountDto {
  @IsOptional()
  @IsUUID()
  user_id?: string;

  @IsOptional()
  @IsUUID()
  payment_provider_id?: string;

  @IsOptional()
  @IsUUID()
  crypto_network_id?: string;

  @IsOptional()
  @IsString()
  wallet_address?: string;

  @IsOptional()
  @IsString()
  tag_or_memo?: string;

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
