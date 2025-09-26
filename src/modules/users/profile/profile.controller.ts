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
  UploadedFile,
  UnauthorizedException,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { User } from '@users/entities/user.entity';
import { UserProfile } from '@users/entities/user-profile.entity';

import { UpdateEmailDto } from './dto/email.profile.dto';
import { UpdatePhoneDto } from './dto/phone.profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserProfileDto } from './dto/udpate-profile.dto';

@ApiTags('Perfiles')
@Controller('users/profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /**
   * GET /users/profiles/my-profile
   * Retorna toda la información del perfil del usuario autenticado.
   */
  @Get('my-profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil obtenido correctamente' })
  @ApiResponse({ status: 401, description: 'Usuario no autenticado o token inválido' })
  async getMyProfile(@Req() req: any) {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    const profile = await this.profileService.getUserProfileById(userId);

    return {
      message: 'Perfil obtenido correctamente',
      result: profile,
    };
  }

  /**
   * PUT /profile/my-profile
   * Actualiza el perfil del usuario autenticado.
   * Solo se modifican los campos enviados en el body.
   */
  @Put('my-profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualizar perfil del usuario autenticado',
    description:
      'Permite a un usuario autenticado actualizar su perfil. ' +
      'Los campos no enviados en el body no se modifican.',
  })
  @ApiBody({ type: UpdateUserProfileDto })
  @ApiResponse({ status: 200, description: 'Perfil actualizado correctamente' })
  @ApiResponse({ status: 400, description: 'Solicitud inválida o datos incompletos' })
  @ApiResponse({ status: 401, description: 'Usuario no autenticado o token inválido' })
  async updateUserProfile(
    @Req() req: any,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('Usuario no autenticado'); 
    }

    try {
      const updatedProfile = await this.profileService.updateUserProfile(
        userId,
        updateUserProfileDto,
      );

      return {
        message: 'Perfil actualizado correctamente',
        result: updatedProfile,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; // 400
      }

      console.error('Error al actualizar perfil:', error);
      throw new InternalServerErrorException(
        'Error interno al actualizar el perfil',
      ); 
    }
  }

  /**
   * PUT /profile/my-profile/picture
   * Actualiza la foto de perfil del usuario autenticado.
   */
  @Put('my-profile/picture')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Actualizar foto de perfil del usuario autenticado',
    description: 'Permite subir y actualizar la imagen de perfil de un usuario autenticado.',
  })
  @ApiBody({
    description: 'Archivo de imagen a subir',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de imagen',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({ status: 200, description: 'Imagen actualizada correctamente' })
  @ApiResponse({ status: 400, description: 'Archivo no enviado o usuario no autenticado' })
  @ApiResponse({ status: 401, description: 'Usuario no autenticado' })
  @ApiResponse({ status: 500, description: 'Error interno al subir la imagen' })
  async updateProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const userId = req.user?.id;

    // Validación de usuario autenticado
    if (!userId) {
      throw new BadRequestException('Usuario no autenticado');
    }

    // Validación de archivo
    if (!file || !file.buffer) {
      throw new BadRequestException('Se requiere una imagen en la solicitud');
    }

    try {
      const result = await this.profileService.updateUserPictureById(userId, file);
      return { message: 'Imagen actualizada correctamente', result };
    } catch (error) {
      console.error('Error al subir la imagen:', error);

      // Detecta errores específicos si tu servicio lanza alguno
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Error interno al subir la imagen');
    }
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
  async updateUserProfileEmailController(@Req() req, @Body() updateEmailDto: UpdateEmailDto) {
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
  @ApiOperation({ summary: 'Actualizar telefono del perfil autenticado' })
  @ApiResponse({ status: 200, description: 'Email actualizado correctamente' })
  async updateUserProfilePhoneController(@Req() req, @Body() updatePhoneDto: UpdatePhoneDto) {
    const userId = req.user.id;
    console.log(userId);

    return this.profileService.updatePhone(userId, updatePhoneDto.phone);
  }
}
