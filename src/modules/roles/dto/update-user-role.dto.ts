import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateUserRoleDto {
  @ApiProperty({
    description: 'Código del rol a asignar al usuario',
    example: 'admin',
  })
  @IsString({ message: 'El código del rol debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El código del rol es requerido' })
  roleCode: string;
}

export class UpdateUserRoleResponseDto {
  @ApiProperty({
    description: 'Id del usuario',
    example: '7c6e9c4a-8f32-4d89-9a20-bf5d8a1c9f45',
  })
  userId: string;

  @ApiProperty({
    description: 'Nuevo rol del usuario',
    example: {
      role_id: '123e4567-e89b-12d3-a456-426614174000',
      code: 'admin',
      name: 'Administrador',
      description: 'Admin del sistema'
    },
  })
  role: {
    role_id: string;
    code: string;
    name: string;
    description?: string;
  };
} 