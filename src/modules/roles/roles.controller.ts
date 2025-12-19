import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  BadRequestException,
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
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UpdateUserRoleResponseDto, AddUserRoleDto } from './dto/update-user-role.dto';

@ApiTags('Roles (Admin)')
@Controller('admin/roles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // Endpoint para obtener todos los roles disponibles
  @Get()
  @ApiOperation({ summary: 'Obtener todos los roles disponibles' })
  @ApiOkResponse({ description: 'Lista de roles obtenida correctamente' })
  @ApiUnauthorizedResponse({ description: 'Usuario no autenticado o token inválido' })
  @ApiForbiddenResponse({ description: 'No autorizado, Solo para Administradores' })
  async getAllRoles() {
    return this.rolesService.getAllRoles();
  }

  // Endpoint para agregar rol adicional a usuario
  @Post('user/:userId/role/add')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Agregar un rol adicional a un usuario sin eliminar roles existentes' })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario al que agregar el rol',
    type: 'string',
  })
  @ApiOkResponse({
    description: 'Rol agregado correctamente al usuario',
    type: UpdateUserRoleResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Campo inválido o rol ya asignado' })
  @ApiUnauthorizedResponse({ description: 'Usuario no autenticado o token inválido' })
  @ApiForbiddenResponse({ description: 'No autorizado, Solo para Administradores' })
  @ApiNotFoundResponse({ description: 'Usuario o rol no encontrado' })
  async addUserRole(@Param('userId') userId: string, @Body() addRoleDto: AddUserRoleDto) {
    const roleCode = addRoleDto.roleCode || addRoleDto.role;
    if (!roleCode) {
      throw new BadRequestException('roleCode o role es requerido');
    }
    return this.rolesService.addUserRole(userId, roleCode);
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
}
