import {
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  Put,
  Req,
  Body,
  Delete,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { User } from '@users/entities/user.entity';
import { UserProfile } from '@users/entities/user-profile.entity';

import { UpdateEmailDto } from './dto/email.profile.dto';
import { UpdatePhoneDto } from './dto/phone.profile.dto';
import { UpdateUserLocationDto } from './dto/location.profile.dto';
import { UpdateNicknameDto } from './dto/nickname.profile.dto';

@ApiTags('Perfiles')
@Controller('users/profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  /**
   * GET /profile/
   * Obtiene todos los perfiles de usuarios existentes.
   * Solo rol 'admin'o 'super_admin' pueden solicitar ver todos los perfiles de usuarios existentes.
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todos los perfiles de usuario' })
  @ApiResponse({
    status: 200,
    description: 'Listado de perfiles de usuario',
    type: [User],
  })
  async findAll() {
    return this.profileService.findAll();
  }
  /**
   * GET /users/profile/my-profile
   * Obtiene el perfil del usuario autenticado mediante el JWT.
   * Requiere autenticación.
   */
  @Get('/my-profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil de usuario por ID' })
  @ApiResponse({
    status: 200,
    description: 'Perfil de usuario',
    type: User,
  })
  async getUserProfileByIdController(
    @Query('userId') userId: string,
  ): Promise<UserProfile> {
    if (!userId || userId.trim() === '') {
      throw new BadRequestException('El ID del usuario es requerido');
    }

    try {
      const profile = await this.profileService.findById(userId);
      if (!profile) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      return profile;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * GET /profile/my-profile/email
   * Obtiene el perfil de un usuario específico según su email.
   * Requiere autenticación.
   */
  @Get('my-profile/email')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil de usuario por email' })
  @ApiResponse({
    status: 200,
    description: 'Perfil de usuario',
    type: UserProfile,
  })
  async getUserProfileByEmailController(
    @Query('email') email: string,
  ): Promise<UserProfile> {
    if (!email || email.trim() === '') {
      throw new BadRequestException('Email is required');
    }
    try {
      const user = await this.profileService.findByEmail(email);
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * PUT /profile/my-profile/nickname
   * Actualiza el apodo del perfil del usuario autenticado.
   * Requiere autenticación.
   */
  @Put('my-profile/nickname')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar nickname del perfil autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Nickname actualizado correctamente',
  })
  async updateUserProfileNicknameController(
    @Req() req,
    @Body() updateNicknameDto: UpdateNicknameDto,
  ) {
    const userId = req.user.id;

    return this.profileService.updateNickname(
      userId,
      updateNicknameDto.nickName,
    );
  }

  /**
   * UPDATE /profile/my-profile/email
   * Actualiza el email del perfil del usuario autenticado.
   * Requiere autenticación de un usuario.
   */
  @Put('my-profile/email')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar email del perfil autenticado' })
  @ApiResponse({ status: 200, description: 'Email actualizado correctamente' })
  async updateUserProfileEmailController(
    @Req() req,
    @Body() updateEmailDto: UpdateEmailDto,
  ) {
    const userId = req.user.id;
    return this.profileService.updateEmail(userId, updateEmailDto.email);
  }

  /**
   * UPDATE /profile/my-profile/phone
   * Actualiza el numero telefónico del perfil del usuario autenticado.
   * Requiere autenticación de un usuario.
   */
  @Put('my-profile/phone')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar email del perfil autenticado' })
  @ApiResponse({ status: 200, description: 'Email actualizado correctamente' })
  async updateUserProfilePhoneController(
    @Req() req,
    @Body() updatePhoneDto: UpdatePhoneDto,
  ) {
    const userId = req.user.id;
    console.log(userId);

    return this.profileService.updatePhone(userId, updatePhoneDto.phone);
  }
  /**
   * UPDATE /profile/my-profile/location
   * Actualiza el ID de la ubicacion de un usuario autenticado.
   * Requiere autenticación de un usuario.
   */
  @Put('my-profile/location')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar ubicación del perfil autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Ubicación actualizada correctamente',
  })
  async updateUserProfileLocationController(
    @Req() req: any,
    @Body() updateUserLocationDto: UpdateUserLocationDto,
  ) {
    const userId = req.user.id;

    return this.profileService.updateLocation(userId, updateUserLocationDto);
  }

  /**
   * DELETE /
   * Elimina el perfil de un usuario por su id.
   */
  @Delete('/')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar perfil' })
  @ApiResponse({
    status: 200,
    description: 'Perfil eliminado correctamente',
  })
  async deleteProfileController(@Req() req: any, @Query('id') id: string) {
    return this.profileService.deleteUserById(id);
  }

  /// foto

  /* @Put('my-profile/picture')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('imgUrl'))
  async updateMyProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const userId = req.user?.['id']; // o usa un decorador @CurrentUser() si lo tenés

    this.logger.debug('Archivo recibido: ' + (file ? 'Sí' : 'No'));

    if (!userId) {
      this.logger.error('Usuario no autenticado.');
      throw new BadRequestException('Usuario no autenticado');
    }

    if (!file || !file.buffer) {
      this.logger.error('No se cargó una imagen válida en el formulario.');
      throw new BadRequestException('Se requiere una imagen en la solicitud');
    }

    try {
      const result = await this.profileService.updateUserPictureById(
        userId,
        file.buffer,
      );
      return { message: 'Imagen actualizada correctamente', result };
    } catch (error) {
      this.logger.error('Error al actualizar la imagen de perfil:', error);
      throw new InternalServerErrorException('Error al subir la imagen');
    }
  } */
}
