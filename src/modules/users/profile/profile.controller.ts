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
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { UpdateEmailDto } from './dto/email.profile.dto';
import { UpdatePhoneDto } from './dto/phone.profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  UpdateUserProfileDto,
  UploadImageDto,
  UploadImageResponseDto,
} from './dto/udpate-profile.dto';
import { ProfileResponseDto, SocialsDto } from '@users/dto/user-response.dto';
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
    type: ProfileResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Usuario no autenticado o token inválido' })
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
    type: ProfileResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Solicitud inválida o datos incompletos' })
  @ApiUnauthorizedResponse({ description: 'Usuario no autenticado o token inválido' })
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
    type: SocialsDto,
  })
  @ApiUnauthorizedResponse({ description: 'Usuario no autenticado o token inválido' })
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
    type: UploadImageDto,
  })
  @ApiOkResponse({
    description: 'Imagen actualizada correctamente',
    type: UploadImageResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Archivo no enviado o usuario no autenticado' })
  @ApiUnauthorizedResponse({ description: 'Usuario no autenticado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno al subir la imagen' })
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
  @ApiOkResponse({ description: 'Email actualizado correctamente' })
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
  @ApiOkResponse({ description: 'Email actualizado correctamente' })
  async updateUserProfilePhoneController(@Req() req, @Body() updatePhoneDto: UpdatePhoneDto) {
    const userId = req.user.id;
    console.log(userId);

    return this.profileService.updatePhone(userId, updatePhoneDto.phone);
  }
}
