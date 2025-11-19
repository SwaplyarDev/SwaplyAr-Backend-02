import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateCountryDto {
  @IsOptional()
  @IsString()
  @Length(3, 3)
  code?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(2, 3)
  currency_default?: string;
}
