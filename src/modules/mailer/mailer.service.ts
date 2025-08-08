/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { existsSync, readFileSync } from 'fs';
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


  /**
   * Envía un correo al usuario cuando el estado de la transacción cambia.
   */

async sendStatusEmail(transaction: any, status: AdminStatus) {
  try {
    const config = this.configService.get('nodemailer');
    const from = config?.auth?.user;

    if (!from || !config.auth.pass) {
      throw new Error(
        'Falta configuración del correo. Verifica las variables de entorno EMAIL_USER y EMAIL_PASS.',
      );
    }

    await this.mailer.verify();

    const statusTemplates: Partial<
      Record<AdminStatus, { subject: string; path: string }>
    > = {
      [AdminStatus.ReviewPayment]: {
        subject: 'Transacción en Revisión de Pago',
        path: 'review-payment.hbs',
      },
      [AdminStatus.Approved]: {
        subject: 'Transacción Aprobada',
        path: 'approved.hbs',
      },
      [AdminStatus.Canceled]: {
        subject: 'Transacción Cancelada',
        path: 'canceled.hbs',
      },
      [AdminStatus.Completed]: {
        subject: 'Transacción Completada',
        path: 'completed.hbs',
      },
      [AdminStatus.Discrepancy]: {
        subject: 'Discrepancia en la Transacción',
        path: 'discrepancy.hbs',
      },
      [AdminStatus.Modified]: {
        subject: 'Transacción Modificada',
        path: 'modified.hbs',
      },
      [AdminStatus.Refunded]: {
        subject: 'Transacción Reembolsada',
        path: 'refunded.hbs',
      },
      [AdminStatus.Rejected]: {
        subject: 'Transacción Rechazada',
        path: 'reject.hbs',
      },
    };

    const selected = statusTemplates[status];
    if (!selected) {
      this.logger.warn(`No hay plantilla de correo definida para el estado: ${status}`);
      return {
        message: `No se envió el correo. No hay plantilla definida para el estado: ${status}`,
      };
    }

    const templatePath = join(
      __dirname,
      '..', '..', '..',
      'modules',
      'mailer',
      'templates',
      'email',
      'transaction',
      'operations_transactions',
      selected.path,
    );

    if (!existsSync(templatePath)) {
      this.logger.warn(`No se encontró la plantilla en la ruta: ${templatePath}`);
      this.logger.warn(`El correo no será enviado porque falta la plantilla.`);
      return {
        message: `No se envió el correo. No se encontró la plantilla para el estado: ${status}`,
      };
    }

    this.logger.log(`Cargando plantilla desde: ${templatePath}`);
    const html = this.compileTemplate(
      templatePath,
      this.buildTemplateData(transaction),
    );

    const mailOptions = {
      from,
      to: transaction.createdBy,
      subject: selected.subject,
      html,
    };

    this.logger.log(`Enviando correo desde ${from} a ${transaction.createdBy}`);
    const result = await this.mailer.sendMail(mailOptions);
    this.logger.log('Correo enviado exitosamente:', result);

    return {
      message: `El correo de estado ha sido enviado a ${transaction.createdBy}`,
    };
  } catch (error) {
    this.logger.error(`Error al enviar el correo de estado: ${error.message}`);
    this.logger.error('Traza del error:', error.stack);
    throw error;
  }
}

  /**
   * Carga y compila un template Handlebars desde el archivo especificado.
   */
  private compileTemplate(
    templatePath: string,
    data: Record<string, any>,
  ): string {
    try {
      const rawTemplate = readFileSync(templatePath, 'utf8');
      const compiled = Handlebars.compile(rawTemplate);
      return compiled(data);
    } catch (error) {
      this.logger.error(`Error compiling template: ${error.message}`);
      throw error;
    }
  }
  /**
   * Construye los datos necesarios para renderizar el template de email.
   */
  private buildTemplateData(transaction: any): Record<string, any> {
    const sender = transaction.senderAccount ?? {};
    const receiver = transaction.receiverAccount ?? {};
    const amount = transaction.amount ?? {};

    return {
      REFERENCE_NUMBER: transaction.id?.slice(0, 8)?.toUpperCase() ?? '',
      MODIFICATION_DATE: new Date().toLocaleDateString('es-AR'),
      NAME: sender.firstName ?? '',
      LAST_NAME: sender.lastName ?? '',
      TRANSACTION_ID: transaction.id,
      BASE_URL:
        this.configService.get('frontendBaseUrl') ?? 'https://swaplyar.com',
      DATE_HOUR: new Date().toLocaleString('es-AR'),
      PHONE_NUMBER: sender.phoneNumber ?? receiver.phoneNumber ?? '',
      AMOUNT_SENT: amount.amountSent ?? 0,
      SENT_CURRENCY: amount.currencySent ?? '',
      AMOUNT_RECEIVED: amount.amountReceived ?? 0,
      RECEIVED_CURRENCY: amount.currencyReceived ?? '',
      PAYMENT_METHOD: receiver.paymentMethod?.bankName ?? 'N/A',
      RECEIVED_NAME: `${receiver.firstName ?? ''} ${receiver.lastName ?? ''}`,
    };
  }
}
