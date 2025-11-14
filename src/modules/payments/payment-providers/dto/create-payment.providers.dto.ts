import { IsString, IsUUID, IsOptional, IsBoolean, Length, MaxLength } from 'class-validator';

export class CreatePaymentProviderDto {
  @IsUUID()
  payment_platform_id: string;

  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @Length(2, 50)
  code: string;

  @IsOptional()
  @IsString()
  @Length(2, 3)
  country?: string;

  @IsOptional()
  @IsString()
  logo_url?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
