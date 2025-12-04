import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class UpdateUserRoleDto {
  @ApiProperty({
    description: 'Nuevo rol del usuario',
    enum: ['user', 'admin', 'super_admin'],
    example: 'admin',
  })
  @IsIn(['user', 'admin', 'super_admin'], { message: 'El rol debe ser user, admin o super_admin' })
  role: string;
}
