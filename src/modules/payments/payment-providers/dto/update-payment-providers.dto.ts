import { IsOptional, IsString, IsBoolean, Length, IsUUID } from 'class-validator';

export class UpdatePaymentProviderDto {
  @IsOptional()
  @IsUUID()
  payment_platform_id?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  code?: string;

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
