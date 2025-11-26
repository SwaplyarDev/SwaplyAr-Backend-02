import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class AddUserRoleDto {
  @ApiProperty({
    description: 'Código del rol a agregar al usuario',
    example: 'moderator',
  })
  @Transform(({ obj }) => obj.roleCode || obj.role, { toClassOnly: true })
  @IsString({ message: 'El código del rol debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El código del rol es requerido' })
  roleCode: string;

  @IsOptional()
  @IsString()
  role?: string;
}

export class UpdateUserRoleResponseDto {
  @ApiProperty({
    description: 'Id del usuario',
    example: '7c6e9c4a-8f32-4d89-9a20-bf5d8a1c9f45',
  })
  userId: string;

  @ApiProperty({
    description: 'Roles del usuario',
    example: [
      {
        role_id: '123e4567-e89b-12d3-a456-426614174000',
        code: 'admin',
        name: 'Administrador',
        description: 'Admin del sistema'
      },
      {
        role_id: '456e7890-e89b-12d3-a456-426614174001',
        code: 'moderator',
        name: 'Moderador',
        description: 'Moderador de contenido'
      }
    ],
  })
  roles: {
    role_id: string;
    code: string;
    name: string;
    description?: string;
  }[];
} 