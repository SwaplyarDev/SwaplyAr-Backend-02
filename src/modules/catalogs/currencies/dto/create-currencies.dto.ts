import { IsString, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCurrencyDto {
  @ApiProperty({
    description: 'Código único de la moneda (ISO 4217)',
    example: 'ARS',
  })
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @Length(3, 3)
  code: string;

  @ApiProperty({
    description: 'Nombre de la moneda',
    example: 'Peso Argentino',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Length(1, 100)
  name: string;

  @ApiProperty({
    description: 'Símbolo de la moneda',
    example: '$',
  })
  @IsString({ message: 'El símbolo debe ser una cadena de texto' })
  @Length(1, 10)
  symbol: string;
}
