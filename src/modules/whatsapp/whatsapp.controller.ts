import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { SendWhatsAppCodeDto } from './dto/send-code.dto';
import { VerifyWhatsAppOtpDto } from './dto/verify-otp.dto';
import { ApiTags, ApiOperation, ApiBody, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('WhatsApp OTP')
@Controller('whatsapp')
export class WhatsAppController {
  constructor(private readonly whatsAppService: WhatsAppService) {}

  @ApiOperation({ summary: 'Enviar código OTP por WhatsApp' })
  @ApiOkResponse({ description: 'Código enviado correctamente' })
  @ApiBody({ type: SendWhatsAppCodeDto })
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() dto: SendWhatsAppCodeDto) {
    return this.whatsAppService.sendOtpCode(dto.phone);
  }

  @ApiOperation({ summary: 'Verificar código OTP recibido por WhatsApp' })
  @ApiOkResponse({ description: 'OTP válido' })
  @ApiBody({ type: VerifyWhatsAppOtpDto })
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() dto: VerifyWhatsAppOtpDto) {
    return this.whatsAppService.verifyOtpCode(dto.phone, dto.code);
  }
}
