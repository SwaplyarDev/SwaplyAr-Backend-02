import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterUserDto } from '@users/dto/register-user.dto';
import { UsersService } from '@users//users.service';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { OtpService } from '@otp/otp.service';
import { DiscountService } from 'src/modules/discounts/discounts.service';

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
  @ApiCreatedResponse({
    description: 'Usuario registrado correctamente',
    type: RegisterUserDto,
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
  async register(@Body() userDto: RegisterUserDto): Promise<RegisterUserDto> {
    const user = await this.usersService.register(userDto);

    await this.otpService.generateAndSendOtp(user);

    return user as unknown as RegisterUserDto;
  }
}
