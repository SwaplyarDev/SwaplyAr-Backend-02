import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { OtpCode } from '../auth/entities/otp-code.entity';
import { User } from '@users/entities/user.entity';
import { generate } from 'otp-generator';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(OtpCode)
    private readonly otpRepo: Repository<OtpCode>,
    private readonly httpService: HttpService,
  ) {}

  async sendOtpCode(phone: string): Promise<{ success: boolean; message: string }> {
    this.logger.log(`Iniciando envío de OTP para teléfono: ${phone}`);

    // Find user by phone
    const user = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('profile.phone = :phone', { phone })
      .getOne();

    if (!user) {
      this.logger.log(`Usuario no encontrado para teléfono: ${phone}`);
      throw new BadRequestException('El teléfono no está asociado a ningún usuario.');
    }

    // Generate OTP
    const code = generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    // Save OTP
    const otp = this.otpRepo.create({
      user,
      phone,
      code,
      expiryDate: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });
    await this.otpRepo.save(otp);

    // Send via WhatsApp
    try {
      await this.sendWhatsAppMessage(phone, `Tu código de verificación es: ${code}`);
      this.logger.log(`OTP enviado exitosamente a: ${phone}`);
      return { success: true, message: 'Código enviado' };
    } catch (error) {
      this.logger.error(`Error enviando OTP: ${(error as Error).message}`);
      throw new InternalServerErrorException('Error enviando código');
    }
  }

  async verifyOtpCode(phone: string, code: string): Promise<{ success: boolean; message: string }> {
    this.logger.log(`Verificando OTP para teléfono: ${phone}, código: ${code}`);

    const otp = await this.otpRepo.findOne({
      where: { phone, code, isUsed: false },
      relations: ['user'],
    });

    if (!otp) {
      throw new BadRequestException('Código inválido');
    }

    if (otp.expiryDate < new Date()) {
      throw new BadRequestException('Código expirado');
    }

    // Mark as used
    otp.isUsed = true;
    await this.otpRepo.save(otp);

    this.logger.log(`OTP verificado exitosamente para: ${phone}`);
    return { success: true, message: 'Código verificado' };
  }

  private async sendWhatsAppMessage(to: string, message: string): Promise<void> {
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!accessToken || !phoneNumberId) {
      throw new InternalServerErrorException('WhatsApp configuration missing');
    }

    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;

    const payload = {
      messaging_product: 'whatsapp',
      to: to.replace(/\D/g, ''), // Remove non-digits
      type: 'text',
      text: { body: message },
    };

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await firstValueFrom(this.httpService.post(url, payload, { headers }));
      this.logger.log(`WhatsApp API response: ${JSON.stringify(response.data)}`);
    } catch (error) {
      this.logger.error(`WhatsApp API error: ${(error as any).response?.data || (error as Error).message}`);
      throw error;
    }
  }
}
