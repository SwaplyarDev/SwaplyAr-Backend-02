import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserRole } from 'src/enum/user-role.enum';

export class UpdateUserRoleDto {
  @ApiProperty({
    description: 'Nuevo rol del usuario',
    /*enum: ['user', 'admin', 'super_admin'],
    example: 'admin',*/

    //AGREGADO PARA LA TAREA.  
    enum: UserRole,
    example: UserRole.Admin,

  })
  /*@IsEnum(['user', 'admin', 'super_admin'])
  role: 'user' | 'admin' | 'super_admin';*/

  //AGREGADO PARA LA TAREA.
  @IsEnum(UserRole, { message: 'El rol debe ser user, admin o super_admin' })
  role: UserRole;

}
