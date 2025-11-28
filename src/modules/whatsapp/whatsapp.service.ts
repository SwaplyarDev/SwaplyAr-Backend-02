import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { OtpCode } from '../auth/entities/otp-code.entity';
import { generateOtp } from '../auth/utils/generate-otp';

@Injectable()
export class WhatsAppService {
  constructor(
    @InjectRepository(OtpCode)
    private otpRepo: Repository<OtpCode>,
    private readonly httpService: HttpService,
  ) {}

 
  async sendOtpCode(phone: string) {
    const code = generateOtp();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos

    const otp = this.otpRepo.create({ phone, code, expiresAt });
    await this.otpRepo.save(otp);

    await this.sendWhatsAppTemplate(phone, code);

    return {
      success: true,
      message: 'OTP enviado por WhatsApp',
    };
  }


  private async sendWhatsAppTemplate(phone: string, code: string) {
    const url = `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_ID}/messages`;

    const payload = {
      messaging_product: 'whatsapp',
      to: phone,
      type: 'template',
      template: {
        name: 'otp_code',
        language: { code: 'es' },
        components: [
          {
            type: 'body',
            parameters: [{ type: 'text', text: code }],
          },
        ],
      },
    };

    try {
      await this.httpService.axiosRef.post(url, payload, {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      console.error(err.response?.data || err);
      throw new BadRequestException(
        'No se pudo enviar el mensaje de WhatsApp',
      );
    }
  }


  async verifyOtpCode(phone: string, code: string) {
    const otp = await this.otpRepo.findOne({
      where: { phone, code, used: false },
    });

    if (!otp) throw new BadRequestException('Código incorrecto');

    if (otp.expiresAt.getTime() < Date.now()) {
      otp.used = true;
      await this.otpRepo.save(otp);
      throw new BadRequestException('El código ha expirado');
    }

    otp.used = true;
    await this.otpRepo.save(otp);

    return { success: true, message: 'OTP validado correctamente' };
  }
}
