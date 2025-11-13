import { IsString, IsOptional, Length } from 'class-validator';

export class CreateCountryDto {
  @IsString()
  @Length(2, 3)
  code: string; // ISO 3166 (ej: ARG, BRA, CHL)

  @IsString()
  @Length(1, 100)
  name: string; // Nombre del país

  @IsOptional()
  @IsString()
  @Length(2, 3)
  currency_default?: string; // Moneda local (ej: CLP, USD)
}
