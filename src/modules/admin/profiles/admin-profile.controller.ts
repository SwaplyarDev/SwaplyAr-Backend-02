import { AdminRoleGuard } from '@common/guards/admin-role.guard';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfileService } from '@users/profile/profile.service';
import { AdminProfileService } from './admin-profile.service';
import { UpdateAdminProfileDto } from '@admin/profiles/dto/update-admin-profile.dto';
import { AdminProfileResponseDto } from '@admin/profiles/dto/admin-profile-response.dto';
import { UpdateAdminProfileResponseDto } from '@admin/profiles/dto/update-admin-profile-response.dto';
import { ApiQuery } from '@nestjs/swagger';
import { VerificationStatus } from '@users/entities/user-verification.entity';

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
  @ApiResponse({
    status: 200,
    description: 'Listado de perfiles de usuario',
    type: AdminProfileResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Usuario no autenticado o token inválido' })
  @ApiResponse({ status: 403, description: 'No autorizado, Solo para Administradores' })
  async findAll(
    @Query('status') status?: VerificationStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const profiles = await this.adminProfileService.findAll(
      status,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
    return profiles;
  }

  /**
   * GET /admin/profiles/by-id
   * Obtiene un perfil de usuario por su ID.
   */
  @Get('by-id')
  @ApiOperation({ summary: 'Obtener perfil de usuario por ID (solo admin)' })
  @ApiResponse({
    status: 200,
    description: 'Perfil encontrado',
    schema: {
      example: {
        message: 'Perfil obtenido correctamente',
        result: {
          id: 'e997eb7b-dc81-4a3b-91f4-784bd76da2d2',
          user: {
            id: 'f3282e57-aaa6-4263-9b17-7db1992d4d76',
            locations: [
              {
                id: 'ea5af371-d47f-4f8e-8771-05f1234446ac',
                country: 'Colombia',
                department: 'Bogota',
                postalCode: '007111',
                date: '2025-09-25T00:00:00.000Z',
              },
            ],
            role: 'admin',
            termsAccepted: true,
            createdAt: '2025-09-25T14:42:52.378Z',
            validatedAt: null,
            isActive: true,
            isValidated: false,
            userValidated: false,
          },
          firstName: 'Jonhatan',
          lastName: 'Pérez',
          nickName: 'JPDev',
          email: 'jacpman1992@gmail.com',
          identification: null,
          phone: '+573001112233',
          birthday: null,
          age: null,
          gender: 'M',
          lastActivity: null,
          socials: null,
          profilePictureUrl: null,
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Usuario no autenticado o token inválido' })
  @ApiResponse({ status: 403, description: 'No autorizado, Solo para Administradores' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
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
  @ApiResponse({
    status: 200,
    description: 'Perfil encontrado',
    schema: {
      example: {
        message: 'Perfil obtenido correctamente',
        result: {
          id: 'e997eb7b-dc81-4a3b-91f4-784bd76da2d2',
          user: {
            id: 'f3282e57-aaa6-4263-9b17-7db1992d4d76',
            locations: [
              {
                id: 'ea5af371-d47f-4f8e-8771-05f1234446ac',
                country: 'Colombia',
                department: 'Bogota',
                postalCode: '007111',
                date: '2025-09-25T00:00:00.000Z',
              },
            ],
            role: 'admin',
            termsAccepted: true,
            createdAt: '2025-09-25T14:42:52.378Z',
            validatedAt: null,
            isActive: true,
            isValidated: false,
            userValidated: false,
          },
          firstName: 'Jonhatan',
          lastName: 'Pérez',
          nickName: 'JPDev',
          email: 'jacpman1992@gmail.com',
          identification: null,
          phone: '+573001112233',
          birthday: null,
          age: null,
          gender: 'M',
          lastActivity: null,
          socials: null,
          profilePictureUrl: null,
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Usuario no autenticado o token inválido' })
  @ApiResponse({ status: 403, description: 'No autorizado, Solo para Administradores' })
  @ApiResponse({ status: 404, description: 'Email del usuario no encontrado' })
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
  @ApiResponse({
    status: 200,
    description: 'Perfil actualizado correctamente',
    type: UpdateAdminProfileResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Campos inválidos o no se enviaron' })
  @ApiResponse({ status: 401, description: 'Usuario no autenticado o token inválido' })
  @ApiResponse({ status: 403, description: 'No autorizado, solo para administradores' })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado' })
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
  @ApiResponse({ status: 200, description: 'Perfil eliminado correctamente' })
  @ApiResponse({ status: 401, description: 'Usuario no autenticado o token inválido' })
  @ApiResponse({ status: 403, description: 'No autorizado, Solo para Administradores' })
  async deleteProfile(@Query('userId') userId: string) {
    if (!userId) {
      throw new BadRequestException('El ID del usuario es requerido');
    }
    await this.adminProfileService.deleteUserById(userId);

    return 'Perfil de usuario eliminado correctamente';
  }
}
