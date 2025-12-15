import { IsString, Length, IsArray, IsUUID, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCountryDto {
  @ApiProperty({
    description: 'Código único del país (ISO 3166)',
    example: 'BRA',
  })
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @Length(2, 3)
  code: string;

  @ApiProperty({
    description: 'Nombre del país',
    example: 'Brasil',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Length(1, 100)
  name: string;

  @ApiProperty({
    description: 'IDs de las monedas soportadas (al menos una requerida)',
    example: ['550e8400-e29b-41d4-a716-446655440001'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Debe proporcionar al menos una moneda' })
  @IsUUID('4', { each: true })
  currencyIds: string[];
}
