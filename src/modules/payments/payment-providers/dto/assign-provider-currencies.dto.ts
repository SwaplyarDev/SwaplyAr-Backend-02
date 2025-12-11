import { IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignProviderCurrenciesDto {
  @ApiProperty({
    description: 'IDs de las monedas a asignar al provider',
    example: ['123e4567-e89b-12d3-a456-426614174000', '987fcdeb-51a2-43d1-b789-123456789abc'],
  })
  @IsArray({ message: 'currencyIds debe ser un array' })
  @IsUUID('4', { each: true, message: 'Cada ID debe ser un UUID válido' })
  currencyIds: string[];
} 