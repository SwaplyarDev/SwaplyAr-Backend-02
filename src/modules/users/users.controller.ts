import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterUserDto, UserResponseDto } from '@users/dto/register-user.dto';
import { UsersService } from '@users//users.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { OtpService } from '@otp/otp.service';
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
}
