import {
  Controller,
  Patch,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { 
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse
} from '@nestjs/swagger';
import { AdminRoleGuard } from '@common/guards/admin-role.guard';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { AdminUserService } from './user-admin.service';
import { UpdateUserRoleDto, UpdateUserRoleResponseDto } from './dto/update-user-role.dto';
import { UpdateUserStatusDto, UpdateUserStatusResponseDto } from './dto/update-user-status-dto';

@ApiTags('Usuarios (Admin)')
@Controller('admin/user')
@UseGuards(JwtAuthGuard, AdminRoleGuard)
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class AdminUserController {
  constructor(private readonly userAdminService: AdminUserService) {}

  @Patch(':userId/role')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Actualizar el rol de un usuario' })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario a actualizar',
    type: 'string',
  })
  @ApiOkResponse({
    description: 'Rol de usuario actualizado correctamente',
    type: UpdateUserRoleResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Campo inválido o no se envio' })
  @ApiUnauthorizedResponse({ description: 'Usuario no autenticado o token inválido' })
  @ApiForbiddenResponse({ description: 'No autorizado, Solo para Administradores' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  async updateUserRole(@Param('userId') userId: string, @Body() updateRoleDto: UpdateUserRoleDto) {
    return this.userAdminService.updateUserRole(userId, updateRoleDto.role);
  }

  @Patch(':userId/status')
  @ApiOperation({ summary: 'Actualizar el estado de un usuario (activo/inactivo)' })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario a actualizar',
    type: 'string',
  })
  @ApiOkResponse({
    description: 'Estado del usuario actualizado correctamente',
    type: UpdateUserStatusResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Campo inválido o no se envio' })
  @ApiUnauthorizedResponse({ description: 'Usuario no autenticado o token inválido' })
  @ApiForbiddenResponse({ description: 'No autorizado, Solo para Administradores' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  async updateUserStatus(
    @Param('userId') userId: string,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
  ) {
    return this.userAdminService.updateUserStatus(userId, updateUserStatusDto);
  }
}
