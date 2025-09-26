import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
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
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserProfile } from '@users/entities/user-profile.entity';
import { ProfileService } from '@users/profile/profile.service';



@ApiTags('Perfiles (Admin)')
@Controller('admin/profiles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'super_admin')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class AdminProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /**
   * GET /admin/profiles
   * Lista todos los perfiles de usuarios.
   */
  @Get()
  @ApiOperation({ summary: 'Listar todos los perfiles de usuario (solo admin)' })
  @ApiResponse({
  status: 200,
  description: 'Listado de perfiles de usuario',
})
@ApiResponse({ status: 401, description: 'Usuario no autenticado o token inválido' })
@ApiResponse({ status: 403, description: 'No autorizado, Solo para Administradores' })
async findAll() {
  const profiles = await this.profileService.findAll();

    const profilesWithoutToken = profiles.map(profile => {
    const userWithoutToken = { ...profile.user };
    delete userWithoutToken.refreshToken;

    return {
      ...profile,
      user: userWithoutToken,
    };
  });

  return {
    message: 'Perfiles obtenidos correctamente',
    result: profilesWithoutToken,
  };
}

  /**
   * GET /admin/profiles/by-id
   * Obtiene un perfil de usuario por su ID.
   */
  @Get('by-id')
  @ApiOperation({ summary: 'Obtener perfil de usuario por ID (solo admin)' })
  @ApiResponse({ status: 200, description: 'Perfil encontrado' })
  @ApiResponse({ status: 401, description: 'Usuario no autenticado o token inválido' })
  @ApiResponse({ status: 403, description: 'No autorizado, Solo para Administradores' })
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
  @ApiResponse({ status: 200, description: 'Perfil encontrado',})
  @ApiResponse({ status: 401, description: 'Usuario no autenticado o token inválido' })
  @ApiResponse({ status: 403, description: 'No autorizado, Solo para Administradores' })
  async findByEmail(@Query('email') email: string)
  {
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
    await this.profileService.deleteUserById(userId);

    return 'Perfil de usuario eliminado correctamente'
  }
}
