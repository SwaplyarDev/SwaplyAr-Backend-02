import { AdminRoleGuard } from '@common/guards/admin-role.guard';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { GetAdminProfilesQueryDto } from '@admin/profiles/dto/admin-profile-response.dto';
import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  UnauthorizedException,
  Patch,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { 
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ProfileService } from '@users/profile/profile.service';
import { AdminProfileService } from './admin-profile.service';
import { UpdateAdminProfileDto } from '@admin/profiles/dto/update-admin-profile.dto';
import { AdminProfileResponseDto } from '@admin/profiles/dto/admin-profile-response.dto';
import { UpdateAdminProfileResponseDto } from '@admin/profiles/dto/update-admin-profile-response.dto';
import { ApiQuery, ApiOkResponse } from '@nestjs/swagger';
import { VerificationStatus } from '@users/entities/user-verification.entity';
import { AdminProfileSearchResponseDto } from './dto/admin-profile-search-response.dto';

@ApiTags('Perfiles (Admin)')
@Controller('admin/profiles')
@UseGuards(JwtAuthGuard, AdminRoleGuard)
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class AdminProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly adminProfileService: AdminProfileService,
  ) {}
  /**
   * GET /admin/profiles
   * Lista todos los perfiles de usuarios.
   */
  @Get()
  @ApiOperation({
    summary: 'Listar perfiles de usuario por estado de verificación (solo admin)',
    description:
      'Permite a los administradores listar perfiles de usuario filtrando por estado de verificación (PENDIENTE, APROBADO, RECHAZADO, REENVIAR_DATOS).',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: VerificationStatus,
    description: 'Filtrar por estado de verificación',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Cantidad de resultados por página',
    example: 10,
  })
  @ApiOkResponse({
    description: 'Listado de perfiles de usuario',
    type: AdminProfileResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Usuario no autenticado o token inválido' })
  @ApiForbiddenResponse({ description: 'No autorizado, Solo para Administradores' })
  async findAll(@Query() query: GetAdminProfilesQueryDto) {
    const profiles = await this.adminProfileService.findAll(query.status, query.page, query.limit);
    return profiles;
  }

  /**
   * GET /admin/profiles/by-id
   * Obtiene un perfil de usuario por su ID.
   */
  @Get('by-id')
  @ApiOperation({ summary: 'Obtener perfil de usuario por ID (solo admin)' })
  @ApiOkResponse({
    description: 'Perfil encontrado',
    type: AdminProfileSearchResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Usuario no autenticado o token inválido' })
  @ApiForbiddenResponse({ description: 'No autorizado, Solo para Administradores' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  async findById(@Query('userId') userId: string) {
    if (!userId) {
      throw new UnauthorizedException('Id de usuario no existe');
    }

    const profile = await this.profileService.getUserProfileById(userId);

    const userWithoutToken = { ...profile.user };
    delete userWithoutToken.refreshToken;

    return {
      message: 'Perfil obtenido correctamente',
      result: {
        ...profile,
        user: userWithoutToken,
      },
    };
  }

  /**
   * GET /admin/profiles/by-email
   * Obtiene un perfil de usuario por su email.
   */
  @Get('by-email')
  @ApiOperation({ summary: 'Obtener perfil de usuario por email (solo admin)' })
  @ApiOkResponse({
    description: 'Perfil encontrado',
    type: AdminProfileSearchResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Usuario no autenticado o token inválido' })
  @ApiForbiddenResponse({ description: 'No autorizado, Solo para Administradores' })
  @ApiForbiddenResponse({ description: 'Email del usuario no encontrado' })
  async findByEmail(@Query('email') email: string) {
    if (!email) {
      throw new UnauthorizedException('El email es requerido');
    }

    const profile = await this.profileService.findByEmail(email);

    const userWithoutToken = { ...profile.user };
    delete userWithoutToken.refreshToken;

    return {
      message: 'Perfil obtenido correctamente',
      result: {
        ...profile,
        user: userWithoutToken,
      },
    };
  }

  /**
   * PATCH /admin/profiles/:id
   * Modificar datos básicos del perfil (solo admin)
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos de un perfil (solo admin)' })
  @ApiOkResponse({
    description: 'Perfil actualizado correctamente',
    type: UpdateAdminProfileResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Campos inválidos o no se enviaron' })
  @ApiUnauthorizedResponse({ description: 'Usuario no autenticado o token inválido' })
  @ApiForbiddenResponse({ description: 'No autorizado, solo para administradores' })
  @ApiNotFoundResponse({ description: 'Perfil no encontrado' })
  async updateProfile(
    @Param('profileId') profileId: string,
    @Body() updateProfileDto: UpdateAdminProfileDto,
  ) {
    const profile = await this.adminProfileService.updateAdminProfile(profileId, updateProfileDto);

    if (!profile) {
      throw new NotFoundException('Perfil no encontrado');
    }

    return profile;
  }

  /**
   * DELETE /admin/profiles
   * Elimina el perfil de un usuario por su ID.
   */
  @Delete()
  @ApiOperation({ summary: 'Eliminar perfil de usuario (solo admin)' })
  @ApiOkResponse({ description: 'Perfil eliminado correctamente' })
  @ApiUnauthorizedResponse({ description: 'Usuario no autenticado o token inválido' })
  @ApiForbiddenResponse({ description: 'No autorizado, Solo para Administradores' })
  async deleteProfile(@Query('userId') userId: string) {
    if (!userId) {
      throw new BadRequestException('El ID del usuario es requerido');
    }
    await this.adminProfileService.deleteUserById(userId);

    return 'Perfil de usuario eliminado correctamente';
  }
}
