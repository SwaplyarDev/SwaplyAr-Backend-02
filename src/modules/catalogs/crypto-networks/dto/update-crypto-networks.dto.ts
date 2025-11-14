import { IsOptional, IsString, Length, IsBoolean } from 'class-validator';

export class UpdateCryptoNetworkDto {
  @IsOptional()
  @IsString()
  @Length(1, 20)
  code?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  title?: string;

  @IsOptional()
  @IsString()
  logo_url?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
