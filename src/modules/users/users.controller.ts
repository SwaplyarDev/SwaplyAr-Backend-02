import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  Patch,
  Param,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { RegisterUserDto, UserResponseDto } from '@users/dto/register-user.dto';
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
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { OtpService } from '@otp/otp.service';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { DiscountService } from '@discounts/services/discounts.service';

@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private otpService: OtpService,
    private discountService: DiscountService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Registrar un nuevo usuario',
    description: `Este endpoint permite registrar un nuevo usuario en el sistema.`,
  })
  @ApiBody({
    description: 'Datos para registrar un usuario',
    type: RegisterUserDto,
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado correctamente',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      '❌ Error de validación. Ej: faltan campos requeridos, email inválido o términos no aceptados.',
  })
  @ApiConflictResponse({
    description: '❌ El correo ya está registrado en el sistema.',
  })
  @ApiInternalServerErrorResponse({
    description: '❌ Error interno al procesar el registro.',
  })
  @Post('register')
  async register(@Body() userDto: RegisterUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.register(userDto);

    await this.otpService.generateAndSendOtp(user);

    await this.discountService.assignSystemDiscount(user, 'WELCOME', 3);

    return user as unknown as UserResponseDto;
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
