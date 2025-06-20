// src/modules/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { SendCodeDto }     from './dto/send-code.dto';
import { ValidateCodeDto } from './dto/validate-code.dto';
import { RefreshDto }      from './dto/refresh.dto';        // solo { userId: string }
import { OtpService }      from '../otp/otp.service';
import { AuthService }     from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('login')
export class AuthController {
  constructor(
      private readonly otpService: OtpService,
      private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Enviar código OTP al email' })
  @ApiResponse({ status: 200, description: 'Código enviado correctamente' })
  @ApiBody({ type: SendCodeDto })
  @Post('email/send')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body() dto: SendCodeDto) {
    await this.otpService.sendOtpToEmail(dto.email);
    return { success: true, message: 'Código enviado correctamente' };
  }

  @ApiOperation({ summary: 'Validar código OTP recibido por email' })
  @ApiResponse({ status: 200, description: 'Tokens generados correctamente' })
  @ApiBody({ type: ValidateCodeDto })
  @Post('email/validate')
  @HttpCode(HttpStatus.OK)
  async validateOtp(@Body() dto: ValidateCodeDto) {
    // valida y marca el código; devuelve el User
    const user = await this.otpService.validateOtpAndGetUser(
        dto.email,
        dto.code,
    );
    // genera y persiste access+refresh
    return this.authService.generateTokens(user);
  }

  @ApiOperation({ summary: 'Renovar access token usando refresh token' })
  @ApiResponse({ status: 200, description: 'Nuevo access token generado' })
  @ApiBody({ type: RefreshDto })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshDto) {
    return this.authService.refreshAccessToken(dto.userId);
  }
}
