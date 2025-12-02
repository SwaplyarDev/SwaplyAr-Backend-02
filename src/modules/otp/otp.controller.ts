import { Controller, Post, Body, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { OtpService } from './otp.service';
import { SendCodeDto } from '@auth/dto/send-code.dto';
import { ValidateCodeDto } from '@auth/dto/validate-code.dto';
import { ApiTags, ApiOperation, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { AuthService } from '@auth/auth.service';

@ApiTags('OTP')
@Controller('login')
export class OtpController {
  constructor(
    private readonly otpService: OtpService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Enviar código OTP al email' })
  @ApiOkResponse({ description: 'Código enviado correctamente' })
  @ApiBody({ type: SendCodeDto })
  @Post('email/send')
  @HttpCode(HttpStatus.OK)
  async send(@Body() dto: SendCodeDto) {
    if (!dto.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(dto.email)) {
      throw new BadRequestException('El correo proporcionado no es válido.');
    }

    try {
      await this.otpService.sendOtpToEmail(dto.email);
      return { success: true, message: 'Código enviado correctamente' };
    } catch (error) {
      let errorMessage = 'Error desconocido';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      throw new BadRequestException(errorMessage || 'Error al enviar el código OTP.');
    }
  }

  @ApiOperation({ summary: 'Validar código OTP recibido por email' })
  @ApiOkResponse({ description: 'OTP válido' })
  @ApiBody({ type: ValidateCodeDto })
  @Post('email/validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validar OTP y generar tokens' })
  @ApiOkResponse({ description: 'Tokens generados' })
  @ApiBody({ type: ValidateCodeDto })
  async validateAndLogin(@Body() dto: ValidateCodeDto) {
    const user = await this.otpService.validateOtpAndGetUser(dto.email, dto.code);
    return this.authService.generateTokens(user);
  }
}
