import { IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCountryDto {
   @ApiProperty({
      description: 'Código único del país (ISO 3166)',
      example: 'ARG',
    })
    @IsOptional()
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @Length(2, 3)
    code: string;
  
    @ApiProperty({
      description: 'Nombre del país',
      example: 'Argentina',
    })
    @IsOptional()
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @Length(1, 100)
    name: string; // Nombre del país
  
  
    @ApiProperty({
      description: 'Código de la moneda',
      example: 'ARS',
    })
    @IsOptional()
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @Length(2, 3)
    currency_default?: string; // Moneda local (ej: CLP, USD)
  }