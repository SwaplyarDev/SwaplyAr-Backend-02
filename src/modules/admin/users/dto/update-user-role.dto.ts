import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserRole } from 'src/enum/user-role.enum';

export class UpdateUserRoleDto {
  @ApiProperty({
    description: 'Nuevo rol del usuario',
    enum: UserRole,
    example: UserRole.Admin,
  })
  @IsEnum(UserRole, { message: 'El rol debe ser user, admin o super_admin' })
  role: UserRole;
}
