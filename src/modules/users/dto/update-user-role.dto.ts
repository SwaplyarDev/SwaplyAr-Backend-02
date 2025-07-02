import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UpdateUserRoleDto {
  @ApiProperty({
    description: 'Nuevo rol del usuario',
    enum: ['user', 'admin', 'super_admin'],
    example: 'admin'
  })
  @IsEnum(['user', 'admin', 'super_admin'])
  role: 'user' | 'admin' | 'super_admin';
} 