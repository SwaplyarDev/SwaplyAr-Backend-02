import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Patch, 
  Param, 
  Get,
  UseInterceptors,
  ClassSerializerInterceptor 
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
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { CreateRoleDto, CreateRoleResponseDto } from './dto/create-roles.dto';
import { RolesService } from './roles.service';
import { AdminRoleGuard } from '../../common/guards/admin-role.guard';
import { UpdateUserRoleDto, UpdateUserRoleResponseDto } from './dto/update-user-role.dto';

// Controlador original para manejo de roles
// @Controller('roles')
// @UseGuards(JwtAuthGuard)
// export class RolesController {
//   constructor(private rolesService: RolesService) {}

//   @Post()
//   @UseGuards(AdminRoleGuard)
//   async createRole(@Body() createRoleDto: CreateRoleDto) {
//     return await this.rolesService.createRole(createRoleDto);
//   }

//   @Post('seed')
//   @UseGuards(AdminRoleGuard)
//   async seedRoles() {
//     const roles = await this.rolesService.seedRoles();
//     return {
//       message: 'Roles creados exitosamente',
//       roles,
//       count: roles.length
//     };
//   }
// }

// Nuevo controlador estilo admin para manejo de roles de usuarios
@ApiTags('Roles (Admin)')
@Controller('admin/roles')
@UseGuards(JwtAuthGuard, AdminRoleGuard)
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // Endpoint para actualizar rol de usuario (similar a user-admin)
  @Patch('user/:userId/role')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Actualizar el rol de un usuario usando códigos de la tabla roles' })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario a actualizar',
    type: 'string',
  })
  @ApiOkResponse({
    description: 'Rol de usuario actualizado correctamente',
    type: UpdateUserRoleResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Campo inválido o no se envió' })
  @ApiUnauthorizedResponse({ description: 'Usuario no autenticado o token inválido' })
  @ApiForbiddenResponse({ description: 'No autorizado, Solo para Administradores' })
  @ApiNotFoundResponse({ description: 'Usuario o rol no encontrado' })
  async updateUserRole(
    @Param('userId') userId: string, 
    @Body() updateRoleDto: UpdateUserRoleDto
  ) {
    return this.rolesService.updateUserRole(userId, updateRoleDto.roleCode);
  }

  // Endpoint para obtener todos los roles disponibles
  @Get()
  @ApiOperation({ summary: 'Obtener todos los roles disponibles' })
  @ApiOkResponse({ description: 'Lista de roles obtenida correctamente' })
  @ApiUnauthorizedResponse({ description: 'Usuario no autenticado o token inválido' })
  @ApiForbiddenResponse({ description: 'No autorizado, Solo para Administradores' })
  async getAllRoles() {
    return this.rolesService.getAllRoles();
  }

  // Endpoint para crear un nuevo rol en la tabla roles
  @Post('create')
  @ApiOperation({ summary: 'Crear un nuevo rol en el sistema' })
  @ApiOkResponse({
    description: 'Rol creado correctamente',
    type: CreateRoleResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Campo inválido o código de rol ya existe' })
  @ApiUnauthorizedResponse({ description: 'Usuario no autenticado o token inválido' })
  @ApiForbiddenResponse({ description: 'No autorizado, Solo para Administradores' })
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return await this.rolesService.createRole(createRoleDto);
  }

  // Endpoint para establecer roles por defecto
  @Post('seed')
  @ApiOperation({ summary: 'Crear roles por defecto del sistema' })
  async seedRoles() {
    const roles = await this.rolesService.seedRoles();
    return {
      message: 'Roles creados exitosamente',
      roles,
      count: roles.length
    };
  }
}