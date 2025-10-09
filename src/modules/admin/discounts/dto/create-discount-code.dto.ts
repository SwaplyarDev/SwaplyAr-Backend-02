import { IsNotEmpty, IsString, IsInt, Min, Max, IsISO8601, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDiscountCodeDto {
  @ApiProperty ({
    description: 'Código alfanumérico único que identifica el descuento global',
    example: 'SUMMER2025' 
  })
  @IsNotEmpty ()
  @IsString ()
  @Length (5, 20, { message: 'El código debe tener entre 5 y 20 caracteres' })
  @Matches (/^[A-Z0-9_-]+$/, { message: 'El código solo puede contener mayúsculas, números, guiones y guiones bajos' })
  code: string;

  @ApiProperty ({
    description: 'Valor fijo del descuento en la moneda especificada (entero entre 1 y 10 USD)',
    example: 10
  })
  @IsNotEmpty ()
  @IsInt ()
  @Min (1, { message: 'El valor mínimo permitido es 1' })
  @Max (10, { message: 'El valor máximo permitido es 10' }) 
  value: number;

  @ApiProperty ({
    description: 'Moneda del descuento (código ISO 4217 en mayúsculas)', 
    example: 'USD'
  })
  @IsNotEmpty ()
  @IsString ()
  @Length (3, 3, { message: 'El código de moneda debe tener exactamente 3 letras' })
  @Matches (/^[A-Z]{3}$/, { message: 'El código de moneda debe ser un código ISO válido en mayúsculas (ej: USD, EUR)' })
  currencyCode: string;

  @ApiProperty ({
    description: 'Fecha de inicio de validez en formato ISO8601',
    example: '2025-08-01T00:00:00Z',
  })
  @IsNotEmpty ()
  @IsISO8601 ({}, { message: 'La fecha debe estar en formato ISO8601' })
  validFrom: string;

  @ApiProperty ({
    description: 'ID del usuario al que se le asignará el descuento (solo Admin/SuperAdmin)',
    example: 'uuid-user-1234',
  })
  @IsNotEmpty ()
  @IsString ()
  userId: string; 
}

