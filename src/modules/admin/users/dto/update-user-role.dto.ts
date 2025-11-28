import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserRole } from 'src/enum/user-role.enum';

export class AdminUpdateUserRoleDto {
  @ApiProperty({
    description: 'Nuevo rol del usuario',
    enum: UserRole,
    example: UserRole.Admin,
  })
  @IsEnum(UserRole, { message: 'El rol debe ser user, admin o super_admin' })
  role: UserRole;
}

export class AdminUpdateUserRoleResponseDto {
  @ApiProperty({
    description: 'Id del usuario',
    example: '7c6e9c4a-8f32-4d89-9a20-bf5d8a1c9f45',
  })
  userId: string;

  @ApiProperty({
    description: 'Nuevo rol del usuario',
    enum: UserRole,
    example: UserRole.Admin,
  })
  role: UserRole;
}
