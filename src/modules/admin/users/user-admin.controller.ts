import { 
  Controller,
  Patch,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor 
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { AdminRoleGuard } from '@common/guards/admin-role.guard';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard'; // asegúrate de tener este guard
import { Roles } from '@common/decorators/roles.decorator'; // asegúrate de tener este decorador
import { User } from '@users/entities/user.entity'; // importa la entidad User
import { AdminUserService } from './user-admin.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserStatusDto } from './dto/update-user-status-dto';


@ApiTags('Usuarios (Admin)')
@Controller('admin/user')
@UseGuards(JwtAuthGuard, AdminRoleGuard)
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class AdminUserController {
  constructor(
    private readonly userAdminService: AdminUserService,
  ) {}

  @Patch(':userId/role')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Actualizar el rol de un usuario' })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario a actualizar',
    type: 'string',
  })
  @ApiResponse({
  status: 200,
  description: 'Rol de usuario actualizado correctamente',
  schema: {
    example: {
      userId: '7c6e9c4a-8f32-4d89-9a20-bf5d8a1c9f45',
      role: 'admin',
    },
  },
  })
  @ApiResponse({ status: 400, description: 'Campo inválido o no se envio' })
  @ApiResponse({ status: 401, description: 'Usuario no autenticado o token inválido' })
  @ApiResponse({ status: 403, description: 'No autorizado, Solo para Administradores' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async updateUserRole(
    @Param('userId') userId: string,
    @Body() updateRoleDto: UpdateUserRoleDto,
  ) {
    return this.userAdminService.updateUserRole(userId, updateRoleDto.role);
  }


  @Patch(':userId/status')
  @ApiOperation({ summary: 'Actualizar el estado de un usuario (activo/inactivo)' })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario a actualizar',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado del usuario actualizado correctamente',
    schema: {
    example: {
      userId: '7c6e9c4a-8f32-4d89-9a20-bf5d8a1c9f45',
      isActive: 'true',
    },
  },
  })
  @ApiResponse({ status: 400, description: 'Campo inválido o no se envio' })
  @ApiResponse({ status: 401, description: 'Usuario no autenticado o token inválido' })
  @ApiResponse({ status: 403, description: 'No autorizado, Solo para Administradores' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async updateUserStatus(
    @Param('userId') userId: string,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
  ) {
    return this.userAdminService.updateUserStatus(userId, updateUserStatusDto);
  }
}
