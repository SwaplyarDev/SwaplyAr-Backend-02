import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { RegisterUserDto } from '@users/dto/register-user.dto';
import { UpdateUserRoleDto } from '@users/dto/update-user-role.dto';
import { UsersService } from '@users//users.service';
import { User } from '@users/entities/user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { OtpService } from '@otp/otp.service';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { DiscountService } from '@discounts/discounts.service';
import { EditUserDto } from './dto/edit-user.dto';

@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private otpService: OtpService,
    private discountService: DiscountService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado correctamente' })
  @ApiBody({
    description: 'Datos para registrar un usuario',
    type: RegisterUserDto,
    examples: {
      ejemplo1: {
        summary: 'Ejemplo de request',
        value: {
          firstName: 'Nahuel',
          lastName: 'Davila',
          email: 'nahuel@gmail.com',
          role: 'user',
          termsAccepted: true,
        },
      },
    },
  })
  @Post('register')
  async register(@Body() userDto: RegisterUserDto): Promise<User> {
    const user = await this.usersService.register(userDto);
    await this.otpService.generateAndSendOtp(user);
    await this.discountService.assignSystemDiscount(user, 'WELCOME', 3);
    return user;
  }

  @Patch(':userId/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Actualizar el rol de un usuario' })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario a actualizar',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Rol de usuario actualizado correctamente',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({
    status: 403,
    description: 'No tiene permisos para realizar esta acción',
  })
  async updateUserRole(
    @Param('userId') userId: string,
    @Body() updateRoleDto: UpdateUserRoleDto,
  ): Promise<User> {
    return this.usersService.updateUserRole(userId, updateRoleDto.role);
  }

  // EDITAR INFORMACION DE USUARIO
  @Patch('/edit/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Editar información del usuario' })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario a actualizar',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado correctamente',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({
    status: 403,
    description: 'No tiene permisos para realizar esta acción',
  })
  @ApiBody({
    description: 'Datos del usuario a actualizar',
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string', example: 'Juan' },
        lastName: { type: 'string', example: 'Pérez' },
        identification: { type: 'string', example: '12345678' },
        phone: { type: 'string', example: '+5491123456789' },
        birthday: { type: 'string', format: 'date', example: '1990-05-15' },
        age: { type: 'integer', example: 34 },
        gender: { type: 'string', enum: ['M', 'F', 'O'], example: 'M' },
        profilePictureUrl: { type: 'string', example: 'https://...jpg' },
        whatsappNumber: { type: 'string', example: '+5491123456789' },
        facebook: { type: 'string', example: 'juan.perez' },
        instagram: { type: 'string', example: '@juanperez' },
        tiktok: { type: 'string', example: '@juan_tiktok' },
        twitterX: { type: 'string', example: '@juanx' },
        snapchat: { type: 'string', example: 'juan_snap' },
        linkedin: { type: 'string', example: 'linkedin.com/in/juan' },
        youtube: { type: 'string', example: 'youtube.com/juan' },
        pinterest: { type: 'string', example: 'pinterest.com/juan' },
      },
    },
  })
  async editUserInfo(
    @Param('userId') userId: string,
    @Body() editUserDto: EditUserDto,
  ): Promise<User> {
    return this.usersService.editUser(userId, editUserDto);
  }
}
