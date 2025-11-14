import { IsString, IsOptional, IsBoolean, Length } from 'class-validator';

export class CreateCryptoNetworkDto {
  @IsString()
  @Length(1, 20)
  code: string;

  @IsString()
  @Length(1, 100)
  title: string;

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
