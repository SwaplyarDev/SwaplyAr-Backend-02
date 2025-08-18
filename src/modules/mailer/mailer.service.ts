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

  /**
   * Envío retrocompatible de código de autenticación:
   * - si `payload` es `string` => envía texto plano (legacy).
   * - si `payload` es un objeto => renderiza plantilla Handlebars.
   */
  async sendAuthCodeMail(
    to: string,
    payload:
      | string
      | {
        NAME: string;
        VERIFICATION_CODE: string;
        BASE_URL: string;
        LOCATION?: string;
        EXPIRATION_MINUTES: number;
      },
    subject = 'Código de verificación - SwaplyAr',
  ) {
    // Determinar "from" con varios fallbacks
    const nodemailerConfig = this.configService.get<any>('nodemailer');
    const from =
      nodemailerConfig?.auth?.user ??
      this.configService.get<string>('EMAIL_USER') ??
      // por si se usaba la ruta con key anidada
      this.configService.get<string>('nodemailer.auth.user');

    if (!from) {
      this.logger.error(
        'Falta configuración del remitente. Verifica EMAIL_USER o la configuración nodemailer.auth.user.',
      );
      throw new Error(
        'Missing email sender configuration. Please set EMAIL_USER or nodemailer.auth.user.',
      );
    }

    // Intentar verificar conexión (no abortamos si falla, solo logueamos)
    try {
      await this.mailer.verify();
      this.logger.log('Mailer verification: OK');
    } catch (err: any) {
      this.logger.warn(`Mailer verification failed: ${err?.message ?? err}`);
      // no throw; permitimos intentar el envío para ambientes donde verify no sea crítico
    }

    // Caso legacy: payload es string => enviar texto simple con el código
    if (typeof payload === 'string') {
      const code = payload;
      const usedSubject = subject ?? 'Código de autenticación';

      await this.mailer.sendMail({
        from,
        to,
        subject: usedSubject,
        text: code,
      });

      return { message: `The code has been sent to the email ${to}` };
    }

    // Caso template: payload es objeto
    const templateRelativeParts = [
      'modules',
      'mailer',
      'templates',
      'email',
      'auth',
      'welcome_verification_code.hbs',
    ];

    // Intentamos 2 ubicaciones: carpeta src (dev) y ruta relativa desde __dirname (dist)
    const templatePathDev = join(process.cwd(), 'src', ...templateRelativeParts);
    const templatePathDist = join(
      __dirname,
      '..',
      '..',
      '..',
      ...templateRelativeParts,
    );

    let templatePath = '';
    if (existsSync(templatePathDev)) {
      templatePath = templatePathDev;
    } else if (existsSync(templatePathDist)) {
      templatePath = templatePathDist;
    } else {
      this.logger.warn(
        `No se encontró la plantilla de verificación en ninguna ruta (intentadas: ${templatePathDev}, ${templatePathDist}). Enviando fallback con texto.`,
      );
      // Fallback: enviar el código en texto si no existe plantilla
      await this.mailer.sendMail({
        from,
        to,
        subject,
        text: `Tu código de verificación es: ${payload.VERIFICATION_CODE}`,
      });
      return { message: `The code has been sent to the email ${to} (fallback text)` };
    }

    // Compilar y enviar la plantilla
    try {
      const html = this.compileTemplate(templatePath, payload);
      await this.mailer.sendMail({
        from,
        to,
        subject,
        html,
      });
      return { message: `The code has been sent to the email ${to}` };
    } catch (error: any) {
      this.logger.error(`Error sending templated auth mail: ${error.message}`);
      throw error;
    }
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
        this.logger.warn(
          `No hay plantilla de correo definida para el estado: ${status}`,
        );
        return {
          message: `No se envió el correo. No hay plantilla definida para el estado: ${status}`,
        };
      }

      const templatePath = join(
        __dirname,
        '..',
        '..',
        '..',
        'modules',
        'mailer',
        'templates',
        'email',
        'transaction',
        'operations_transactions',
        selected.path,
      );

      if (!existsSync(templatePath)) {
        this.logger.warn(
          `No se encontró la plantilla en la ruta: ${templatePath}`,
        );
        this.logger.warn(
          `El correo no será enviado porque falta la plantilla.`,
        );
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

      this.logger.log(
        `Enviando correo desde ${from} a ${transaction.createdBy}`,
      );
      const result = await this.mailer.sendMail(mailOptions);
      this.logger.log('Correo enviado exitosamente:', result);

      return {
        message: `El correo de estado ha sido enviado a ${transaction.createdBy}`,
      };
    } catch (error: any) {
      this.logger.error(
        `Error al enviar el correo de estado: ${error.message}`,
      );
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
    } catch (error: any) {
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


  async sendReviewPaymentEmail(senderEmail: string, transaction: any) {
  const context = this.buildReviewPaymentTemplateData(transaction);

  // Determinar "from" con varios fallbacks
  const nodemailerConfig = this.configService.get<any>('nodemailer');
  const from =
    nodemailerConfig?.auth?.user ??
    this.configService.get<string>('EMAIL_USER') ??
    this.configService.get<string>('nodemailer.auth.user');

  // Ruta del template
  const templatePath = join(
    __dirname,
    '..',
    '..',
    '..',
    'modules',
    'mailer',
    'templates',
    'email',
    'transaction',
    'operations_transactions',
    'review-payment.hbs',
  );

  const html = this.compileTemplate(templatePath, context);

  await this.mailer.sendMail({
    from,
    to: senderEmail,
    subject: 'Revisión de pago',
    html,
  });
}

/**
 * Construye los datos necesarios para el template review-payment.hbs.
 */
private buildReviewPaymentTemplateData(transaction: any): Record<string, any> {
  const sender = transaction.senderAccount ?? {};
  const receiver = transaction.receiverAccount ?? {};
  const amount = transaction.amount ?? {};

  return {
    REFERENCE_NUMBER: transaction.id?.slice(0, 8)?.toUpperCase() ?? '',
    TRANSACTION_ID: transaction.id,
    NAME: sender.firstName ?? '',
    LAST_NAME: sender.lastName ?? '',
    PHONE_NUMBER: sender.phoneNumber ?? receiver.phoneNumber ?? '',
    AMOUNT_SENT: amount.amountSent ?? 0,
    SENT_CURRENCY: amount.currencySent ?? '',
    PAYMENT_METHOD: sender.paymentMethod?.method ?? 'No especificado',
    AMOUNT_RECEIVED: amount.amountReceived ?? 0,
    RECEIVED_CURRENCY: amount.currencyReceived ?? '',
    RECEIVED_NAME: receiver.firstName ?? 'No especificado',
    BASE_URL: this.configService.get('frontendBaseUrl') ?? 'https://swaplyar.com',
    DATE_HOUR: new Date().toLocaleString('es-AR'),
    MODIFICATION_DATE: new Date().toLocaleDateString('es-AR'),
  };
}



}
