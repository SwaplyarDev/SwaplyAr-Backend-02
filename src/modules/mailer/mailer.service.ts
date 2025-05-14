import { Injectable, Logger } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailerService {
  private readonly mailer: Transporter;
  private readonly logger = new Logger(MailerService.name);

  constructor(private readonly configService: ConfigService) {
    this.mailer = createTransport(
      configService.get<SMTPTransport.Options>('nodemailer'),
    );
  }

  async sendMail(to: string, message: string) {
    const from = this.configService.get<string>('nodemailer.auth.user');
    this.logger.log(`Mailer verification: ${await this.mailer.verify()}`);
    this.logger.log(`Sending mail from ${from} to ${to}`);
    await this.mailer.sendMail({
      from,
      to,
      subject: 'Código de autenticación',
      text: message,
    });
  }
}
