import {
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  BadRequestException,
  InternalServerErrorException,
  Put,
  Req,
  Body,
  Delete,
  UploadedFile,
  UnauthorizedException,
  Patch,
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
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
} from '@nestjs/swagger';
import { UpdateEmailDto } from './dto/email.profile.dto';
import { UpdatePhoneDto } from './dto/phone.profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserProfileDto } from './dto/udpate-profile.dto';
import { ProfileResponseDto } from '@users/dto/user-response.dto';
import { UpdateUserSocialsDto } from './dto/update-user-socials.dto';

@ApiTags('Perfiles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('users/profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /**
   * GET /users/profiles/my-profile
   * Retorna toda la información del perfil del usuario autenticado.
   */
  @Get('my-profile')
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiOkResponse({
    description: 'Perfil del usuario con redes sociales',
    schema: {
      example: {
        id: '3305af05-9a75-46b7-8f82-1cdd10af47de',
        user: {
          id: 'd8e5fcb1-cf4b-4de9-823a-b075dfadaca2',
          locations: [
            {
              id: '1a5bcb6c-2f9a-4677-b51e-9ee2fc295a5d',
              country: 'Colombia',
              department: 'Antioquia',
              postalCode: '050021',
              date: '2025-09-24T00:00:00.000Z',
            },
          ],
          role: 'user',
          termsAccepted: true,
          createdAt: '2025-09-25T14:42:02.386Z',
          validatedAt: null,
          isActive: true,
          isValidated: false,
          userValidated: false,
        },
        firstName: 'Nahuel',
        lastName: 'Davila',
        nickName: 'JoseDev',
        email: 'coronajonhatan@gmail.com',
        identification: null,
        phone: null,
        birthday: null,
        age: null,
        gender: 'M',
        lastActivity: null,
        socials: {
          id: 'e45ca483-76fb-47df-b5ce-295b4bddbf70',
          whatsappNumber: '+5731134334567',
          facebook: 'https://facebook.com/user',
          instagram: 'https://instagram.com/user',
          tiktok: 'https://tiktok.com/@user',
          twitterX: 'https://twitter.com/user',
          snapchat: 'https://snapchat.com/add/user',
          linkedin: 'https://linkedin.com/in/user',
          youtube: 'https://youtube.com/user',
          pinterest: 'https://pinterest.com/user',
        },
        profilePictureUrl: null,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Usuario no autenticado o token inválido' })
  async getMyProfile(@Req() req: any) {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    const profile = await this.profileService.getUserProfileById(userId);

    // Si prefieres hacerlo manual:
    const userWithoutToken = { ...profile.user };
    delete userWithoutToken.refreshToken;

    return {
      ...profile,
      user: userWithoutToken,
    };
  }

  /**
   * PUT /profile/my-profile
   * Actualiza el perfil del usuario autenticado.
   * Solo se modifican los campos enviados en el body.
   */
  @Put('my-profile')
  @ApiOperation({
    summary: 'Actualizar perfil del usuario autenticado',
    description:
      'Permite a un usuario autenticado actualizar su perfil. ' +
      'Los campos no enviados en el body no se modifican.',
  })
  @ApiBody({ type: UpdateUserProfileDto })
  @ApiOkResponse({
    description: 'Perfil del usuario',
    schema: {
      example: {
        id: '3305af05-9a75-46b7-8f82-1cdd10af47de',
        user: {
          id: 'd8e5fcb1-cf4b-4de9-823a-b075dfadaca2',
          locations: [
            {
              id: '1a5bcb6c-2f9a-4677-b51e-9ee2fc295a5d',
              country: 'Colombia',
              department: 'Antioquia',
              postalCode: '050021',
              date: '2025-09-24T00:00:00.000Z',
            },
          ],
          role: 'user',
          termsAccepted: true,
          createdAt: '2025-09-25T14:42:02.386Z',
          validatedAt: null,
          isActive: true,
          isValidated: false,
          userValidated: false,
        },
        firstName: 'Nahuel',
        lastName: 'Davila',
        nickName: 'JoseDev',
        email: 'coronajonhatan@gmail.com',
        identification: null,
        phone: null,
        birthday: null,
        age: null,
        gender: 'M',
        lastActivity: null,
        profilePictureUrl: null,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Solicitud inválida o datos incompletos' })
  @ApiResponse({ status: 401, description: 'Usuario no autenticado o token inválido' })
  async updateUserProfile(
    @Req() req: any,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<ProfileResponseDto> {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    try {
      const updatedProfile = await this.profileService.updateUserProfile(
        userId,
        updateUserProfileDto,
      );

      const userWithoutToken = { ...updatedProfile.user };
      delete userWithoutToken.refreshToken;

      // Retorno corregido
      return {
        ...updatedProfile,
        user: userWithoutToken,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      console.error('Error al actualizar perfil:', error);
      throw new InternalServerErrorException('Error interno al actualizar el perfil');
    }
  }

  @Patch('socials')
  @ApiOperation({
    summary: 'Actualizar redes sociales del usuario autenticado',
    description:
      'Permite actualizar una o varias redes sociales. Solo los campos enviados se modifican.',
  })
  @ApiBody({ type: UpdateUserSocialsDto })
  @ApiOkResponse({
    description: 'Redes sociales actualizadas correctamente',
    schema: {
      example: {
        message: 'Redes sociales actualizadas correctamente',
        result: {
          id: 'e45ca483-76fb-47df-b5ce-295b4bddbf70',
          whatsappNumber: '+5730013425567',
          facebook: 'https://facebook.com/user',
          instagram: 'https://instagram.com/user',
          tiktok: 'https://tiktok.com/@user',
          twitterX: 'https://twitter.com/user',
          snapchat: 'https://snapchat.com/add/user',
          linkedin: 'https://linkedin.com/in/user',
          youtube: 'https://youtube.com/user',
          pinterest: 'https://pinterest.com/user',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Usuario no autenticado o token inválido' })
  async updateSocials(@Req() req: any, @Body() updateUserSocialsDto: UpdateUserSocialsDto) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException();

    const updated = await this.profileService.updateUserSocials(userId, updateUserSocialsDto);
    return { message: 'Redes sociales actualizadas correctamente', result: updated };
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
  @ApiOkResponse({
    description: 'Imagen actualizada correctamente',
    schema: {
      example: {
        message: 'Imagen actualizada correctamente',
        result: {
          imgUrl:
            'https://res.cloudinary.com/dy1jiclwg/image/upload/v1759156800/profile-pictures/profile_d8e5fcb1-cf4b-4de9-823a-b075dfadaca2_1759156797456.png',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Archivo no enviado o usuario no autenticado' })
  @ApiResponse({ status: 401, description: 'Usuario no autenticado' })
  @ApiResponse({ status: 500, description: 'Error interno al subir la imagen' })
  async updateProfilePicture(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
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
