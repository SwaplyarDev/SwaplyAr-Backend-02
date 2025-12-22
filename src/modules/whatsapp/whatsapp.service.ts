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
    console.log('Enviando OTP a teléfono:', phone);
    const code = generateOtp();
    console.log('Código generado:', code);

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos

    const otp = this.otpRepo.create({ phone, code, expiresAt });
    console.log('OTP creado:', otp);
    await this.otpRepo.save(otp);
    console.log('OTP guardado en DB');

    await this.sendWhatsAppTemplate(phone, code);

    return {
      success: true,
      message: 'OTP enviado por WhatsApp',
    };
  }


  private async sendWhatsAppTemplate(phone: string, code: string) {
    // Para usar modo simulación, cambia esta variable a true
    // Cambiar a false cuando el template 'otp_code' esté aprobado
    const useSimulation = true;
    
    if (useSimulation) {
      console.log('🔧 MODO SIMULACIÓN - WhatsApp');
      console.log(`📱 Teléfono: ${phone}`);
      console.log(`🔢 Código OTP: ${code}`);
      console.log('✅ WhatsApp simulado enviado exitosamente');
      return;
    }

    const url = `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

    // Remove + from phone number for WhatsApp API
    const cleanPhone = phone.replace(/^\+/, '');
    console.log('Teléfono limpio para WhatsApp:', cleanPhone);

    // Para números de prueba, usar mensaje libre
    const payload = {
      messaging_product: 'whatsapp',
      to: cleanPhone,
      type: 'text',
      text: {
        body: `Tu código de verificación para SwaplyAR es: ${code}\n\nEste código expira en 5 minutos.`
      }
    };

    console.log('Enviando payload a WhatsApp:', JSON.stringify(payload, null, 2));

    try {
      const response = await this.httpService.axiosRef.post(url, payload, {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Respuesta de WhatsApp:', response.data);
    } catch (err: any) {
      console.error('Error en WhatsApp API:', err.response?.data || err.message);
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
