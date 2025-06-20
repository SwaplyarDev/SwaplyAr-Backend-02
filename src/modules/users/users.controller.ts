import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterUserDto } from '@users/dto/register-user.dto';
import { UsersService } from '@users//users.service';
import { User } from '@users/entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import {OtpService} from "../otp/otp.service";

@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
  constructor(
      private usersService: UsersService,
      private otpService: OtpService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado correctamente'})
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
          termsAccepted: true
        }
      }
    }
  })
  @Post('register')
  async register(@Body() userDto: RegisterUserDto): Promise<User> {
    const user = await this.usersService.register(userDto);
    await this.otpService.generateAndSendOtp(user);
    return user;
  }
}
