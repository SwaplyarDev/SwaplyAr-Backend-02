import { Injectable, Logger } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { readFileSync } from 'fs';
import { join } from 'path';
import { AdminStatus } from 'src/enum/admin-status.enum';

@Injectable()
export class MailerService {
  private readonly mailer: Transporter;
  private readonly logger = new Logger(MailerService.name);

  constructor(private readonly configService: ConfigService) {
    this.mailer = createTransport(
      configService.get<SMTPTransport.Options>('nodemailer'),
    );
  }

  async sendAuthCodeMail(to: string, code: string) {
    const from = this.configService.get<string>('nodemailer.auth.user');
    this.logger.log(`Mailer verification: ${await this.mailer.verify()}`);
    this.logger.log(`Sending mail from ${from} to ${to}`);

    await this.mailer.sendMail({
      from,
      to,
      subject: 'Código de autenticación',
      text: code, // Email templates will be added later.
    });

    return { message: `The code has been sent to the email ${to}` };
  }

  async sendStatusEmail(to: string, status: AdminStatus) {
    try {
      // Verificar configuración
      const config = this.configService.get('nodemailer');
      this.logger.log('Nodemailer config:', config);

      const from = config.auth.user;
      if (!from || !config.auth.pass) {
        throw new Error(
          'Missing email configuration. Please check EMAIL_USER and EMAIL_PASS environment variables.',
        );
      }

      this.logger.log(`Mailer verification: ${await this.mailer.verify()}`);
      this.logger.log(`Sending mail from ${from} to ${to}`);

      let subject = '';
      let html = '';
      let templatePath = '';

      switch (status) {
        case AdminStatus.Approved:
          subject = 'Transacción Aprobada';
          templatePath = join(
            __dirname,
            'templates/email/transaction/operations_transactions/approved.html',
          );
          break;
        case AdminStatus.Canceled:
          subject = 'Transacción Cancelada';
          templatePath = join(
            __dirname,
            'templates/email/transaction/operations_transactions/canceled.html',
          );
          break;
        case AdminStatus.Completed:
          subject = 'Transacción Completada';
          templatePath = join(
            __dirname,
            'templates/email/transaction/operations_transactions/completed.html',
          );
          break;
        case AdminStatus.Discrepancy:
          subject = 'Discrepancia en la Transacción';
          templatePath = join(
            __dirname,
            'templates/email/transaction/operations_transactions/discrepancy.html',
          );
          break;
        case AdminStatus.Modified:
          subject = 'Transacción Modificada';
          templatePath = join(
            __dirname,
            'templates/email/transaction/operations_transactions/modified.html',
          );
          break;
        case AdminStatus.Refunded:
          subject = 'Transacción Reembolsada';
          templatePath = join(
            __dirname,
            'templates/email/transaction/operations_transactions/refunded.html',
          );
          break;
        case AdminStatus.Rejected:
          subject = 'Transacción Rechazada';
          templatePath = join(
            __dirname,
            'templates/email/transaction/operations_transactions/reject.html',
          );
          break;
      }

      this.logger.log(`Loading template from: ${templatePath}`);
      try {
        html = readFileSync(templatePath, 'utf8');
        this.logger.log('Template loaded successfully');
      } catch (error) {
        this.logger.error(`Error loading template: ${error.message}`);
        throw error;
      }

      const mailOptions = {
        from,
        to,
        subject,
        html,
      };

      this.logger.log('Sending mail with options:', {
        ...mailOptions,
        html: 'HTML content hidden for brevity',
      });
      const result = await this.mailer.sendMail(mailOptions);
      this.logger.log('Mail sent successfully:', result);

      return { message: `The status email has been sent to ${to}` };
    } catch (error) {
      this.logger.error(`Error sending status email: ${error.message}`);
      this.logger.error('Stack trace:', error.stack);
      throw error;
    }
  }
}
