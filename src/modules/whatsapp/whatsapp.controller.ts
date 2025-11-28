import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { SendWhatsAppCodeDto } from './dto/send-code.dto';
import { VerifyWhatsAppOtpDto } from './dto/verify-otp.dto';

@Controller('whatsapp')
export class WhatsAppController {
  constructor(private readonly whatsAppService: WhatsAppService) {}

  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  sendCode(@Body() dto: SendWhatsAppCodeDto) {
    return this.whatsAppService.sendOtpCode(dto.phone);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  verifyOtp(@Body() dto: VerifyWhatsAppOtpDto) {
    return this.whatsAppService.verifyOtpCode(dto.phone, dto.code);
  }
}
