import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Código único del rol',
    example: 'moderator',
  })
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El código es requerido' })
  code: string;

  @ApiProperty({
    description: 'Nombre descriptivo del rol',
    example: 'Moderador',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name: string;

  @ApiProperty({
    description: 'Descripción opcional del rol y sus permisos',
    example: 'Moderador de contenido y usuarios',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  description?: string;
}

export class CreateRoleResponseDto {
  @ApiProperty({
    description: 'ID único del rol creado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  role_id: string;

  @ApiProperty({
    description: 'Código único del rol',
    example: 'moderator',
  })
  code: string;

  @ApiProperty({
    description: 'Nombre descriptivo del rol',
    example: 'Moderador',
  })
  name: string;

  @ApiProperty({
    description: 'Descripción del rol',
    example: 'Moderador de contenido y usuarios',
  })
  description: string;

  @ApiProperty({
    description: 'Fecha de creación del rol',
    example: '2024-01-15T10:30:00Z',
  })
  created_at: Date;
}