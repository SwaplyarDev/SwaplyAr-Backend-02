import { IsUUID, IsString, IsOptional, Length } from 'class-validator';

export class CreateCryptoAccountDto {
  @IsUUID()
  user_id: string;

  @IsUUID()
  payment_provider_id: string;

  @IsUUID()
  crypto_network_id: string;

  @IsString()
  wallet_address: string;

  @IsOptional()
  @IsString()
  tag_or_memo?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  owner_type?: string;

  @IsUUID()
  created_by_id: string;
}
