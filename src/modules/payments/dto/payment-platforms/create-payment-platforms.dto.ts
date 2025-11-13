import { IsString, IsOptional, IsBoolean, Length, MaxLength } from 'class-validator';

export class CreatePaymentPlatformDto {
  @IsString()
  @Length(2, 50)
  code: string;

  @IsString()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
