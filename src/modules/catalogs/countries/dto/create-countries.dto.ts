import { IsString, IsOptional, Length, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCountryDto {
  @ApiProperty({
    description: 'Código único del país (ISO 3166)',
    example: 'ARG',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Length(2, 3)
  code: string;

  @ApiProperty({
    description: 'Nombre del país',
    example: 'Argentina',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Length(1, 100)
  name: string; // Nombre del país

  @ApiProperty({
    description: 'ID de la moneda por defecto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'El ID de la moneda debe ser un UUID válido' })
  currencyId: string;
}
