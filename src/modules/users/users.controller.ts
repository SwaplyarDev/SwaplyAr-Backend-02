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
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private otpService: OtpService,
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
}
