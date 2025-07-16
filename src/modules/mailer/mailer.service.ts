/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { readFileSync } from 'fs';
import { join } from 'path';
import { AdminStatus } from 'src/enum/admin-status.enum';
import Handlebars from 'handlebars';

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

  async sendStatusEmail(transaction: any, status: AdminStatus) {
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
      this.logger.log(`Sending mail from ${from} to ${transaction.createdBy}`);

      let subject = '';
      let hbs = '';
      let templatePath = '';

      switch (status) {
        case AdminStatus.Approved:
          subject = 'Transacción Aprobada';
          templatePath = join(
            __dirname,
            'templates/email/transaction/operations_transactions/approved.hbs',
          );
          break;
        case AdminStatus.Canceled:
          subject = 'Transacción Cancelada';
          templatePath = join(
            __dirname,
            'templates/email/transaction/operations_transactions/canceled.hbs',
          );
          break;
        case AdminStatus.Completed:
          subject = 'Transacción Completada';
          templatePath = join(
            __dirname,
            'templates/email/transaction/operations_transactions/completed.hbs',
          );
          break;
        case AdminStatus.Discrepancy:
          subject = 'Discrepancia en la Transacción';
          templatePath = join(
            __dirname,
            'templates/email/transaction/operations_transactions/discrepancy.hbs',
          );
          break;
        case AdminStatus.Modified:
          subject = 'Transacción Modificada';
          templatePath = join(
            __dirname,
            'templates/email/transaction/operations_transactions/modified.hbs',
          );
          break;
        case AdminStatus.Refunded:
          subject = 'Transacción Reembolsada';
          templatePath = join(
            __dirname,
            'templates/email/transaction/operations_transactions/refunded.hbs',
          );
          break;
        case AdminStatus.Rejected:
          subject = 'Transacción Rechazada';
          templatePath = join(
            __dirname,
            'templates/email/transaction/operations_transactions/reject.hbs',
          );
          break;
      }

      this.logger.log(`Loading template from: ${templatePath}`);
      try {
        const rawTemplate = readFileSync(templatePath, 'utf8');
        const compiledTemplate = Handlebars.compile(rawTemplate);
        hbs = compiledTemplate({
          REFERENCE_NUMBER: transaction.id.slice(0, 8).toUpperCase(),
          MODIFICATION_DATE: new Date().toLocaleDateString('es-AR'),
          NAME: transaction.senderAccount?.firstName ?? '',
          LAST_NAME: transaction.senderAccount?.lastName ?? '',
          TRANSACTION_ID: transaction.id,
          BASE_URL:
            this.configService.get('frontendBaseUrl') ?? 'https://swaplyar.com',
          DATE_HOUR: new Date().toLocaleString('es-AR'),
          PHONE_NUMBER:
            transaction.senderAccount?.phoneNumber ??
            transaction.receiverAccount?.phoneNumber ??
            '',
          AMOUNT_SENT: transaction.amount?.amountSent ?? 0,
          SENT_CURRENCY: transaction.amount?.currencySent ?? '',
          AMOUNT_RECEIVED: transaction.amount?.amountReceived ?? 0,
          RECEIVED_CURRENCY: transaction.amount?.currencyReceived ?? '',
          PAYMENT_METHOD:
            transaction.receiverAccount?.paymentMethod?.bankName ?? 'N/A',
          RECEIVED_NAME: `${transaction.receiverAccount?.firstName ?? ''} ${transaction.receiverAccount?.lastName ?? ''}`,
        });

        this.logger.log('Template loaded successfully');
      } catch (error) {
        this.logger.error(`Error loading template: ${error.message}`);
        throw error;
      }

      const mailOptions = {
        from,
        to: transaction.createdBy,
        subject,
        html: hbs,
      };

      this.logger.log('Sending mail with options:', {
        ...mailOptions,
        hbs: 'hbs content hidden for brevity',
      });
      const result = await this.mailer.sendMail(mailOptions);
      this.logger.log('Mail sent successfully:', result);

      return {
        message: `The status email has been sent to ${transaction.createdBy}`,
      };
    } catch (error) {
      this.logger.error(`Error sending status email: ${error.message}`);
      this.logger.error('Stack trace:', error.stack);
      throw error;
    }
  }
}
