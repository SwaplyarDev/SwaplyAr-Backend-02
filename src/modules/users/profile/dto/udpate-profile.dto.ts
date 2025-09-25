import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Express } from 'express';

export class UpdateUserLocationDto {
  @ApiProperty({ example: 'Colombia', description: 'País del usuario' })
  @IsString()
  country: string;

  @ApiProperty({ example: 'Antioquia', description: 'Departamento o estado' })
  @IsString()
  department: string;

  @ApiProperty({ example: '050021', description: 'Código postal' })
  @IsString()
  postalCode: string; // obligatorio como los demás

  @ApiProperty({ example: '2025-09-24', description: 'Fecha asociada a la ubicación (opcional)' })
  @IsOptional()
  @IsString()
  date?: string;
}

export class UpdateUserProfileDto {
  @ApiPropertyOptional({
    example: 'JoseDev',
    description: 'Apodo del usuario',
  })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiPropertyOptional({
    type: UpdateUserLocationDto,
    description: 'Información de ubicación del usuario',
    example: {
      country: 'Colombia',
      department: 'Antioquia',
      postalCode: '050021',
      date: '2025-09-24',
    },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUserLocationDto)
  location?: UpdateUserLocationDto;
}
