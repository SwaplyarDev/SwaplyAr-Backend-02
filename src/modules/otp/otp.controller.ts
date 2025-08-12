import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { OtpService } from './otp.service';
import { SendCodeDto } from '@auth/dto/send-code.dto';
import { ValidateCodeDto } from '@auth/dto/validate-code.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from '@auth/auth.service';

@ApiTags('OTP')
@Controller('login')
export class OtpController {
  constructor(
    private readonly otpService: OtpService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Enviar código OTP al email' })
  @ApiResponse({ status: 200, description: 'Código enviado correctamente' })
  @ApiBody({ type: SendCodeDto })
  @Post('email/send')
  @HttpCode(HttpStatus.OK)
  async send(@Body() dto: SendCodeDto) {
    await this.otpService.sendOtpToEmail(dto.email);
    return { success: true, message: 'Código enviado correctamente' };
  }

  @ApiOperation({ summary: 'Validar código OTP recibido por email' })
  @ApiResponse({ status: 200, description: 'OTP válido' })
  @ApiBody({ type: ValidateCodeDto })
  @Post('email/validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validar OTP y generar tokens' })
  @ApiResponse({ status: 200, description: 'Tokens generados' })
  @ApiBody({ type: ValidateCodeDto })
  async validateAndLogin(@Body() dto: ValidateCodeDto) {
    const user = await this.otpService.validateOtpAndGetUser(
      dto.email,
      dto.code,
    );
    return this.authService.generateTokens(user);
  }
}
