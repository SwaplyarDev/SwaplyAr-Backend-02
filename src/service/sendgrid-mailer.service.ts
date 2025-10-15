// Configuración para usar SendGrid como transport de Nodemailer
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';
import * as sgTransport from 'nodemailer-sendgrid-transport';

@Injectable()
export class SendgridMailerService {
  private readonly mailer: Transporter;
  private readonly logger = new Logger(SendgridMailerService.name);

  constructor(private readonly configService: ConfigService) {
    const sendgridApiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (!sendgridApiKey) {
      throw new Error('SENDGRID_API_KEY no está configurada');
    }
    this.mailer = createTransport(
      sgTransport({
        auth: {
          api_key: sendgridApiKey,
        },
      })
    );
    this.logger.log('SendgridMailerService inicializado');
  }

  async sendMail(options: any) {
    try {
      const result = await this.mailer.sendMail(options);
      this.logger.log('Correo enviado con SendGrid:', result);
      return result;
    } catch (error) {
      this.logger.error('Error enviando correo con SendGrid:', error);
      throw error;
    }
  }
}
