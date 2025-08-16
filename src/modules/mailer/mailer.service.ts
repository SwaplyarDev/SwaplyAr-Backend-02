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
    const templatePathDev = join(
      process.cwd(),
      'src',
      ...templateRelativeParts,
    );
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
      return {
        message: `The code has been sent to the email ${to} (fallback text)`,
      };
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

      if (!from || !config?.auth?.pass) {
        this.logger.error(
          'Falta configuración del correo. Verifica las variables de entorno EMAIL_USER y EMAIL_PASS.',
        );
        return { message: 'Mailer no configurado correctamente' };
      }

      // Intento de verificación (no abortamos completamente si falla)
      try {
        await this.mailer.verify();
        this.logger.debug('Mailer verification: OK');
      } catch (verifyErr: any) {
        this.logger.warn(
          `Mailer verification failed (continuando): ${verifyErr?.message ?? verifyErr}`,
        );
      }

      // Templates mapping...
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
          message: `No se envió el correo. No hay plantilla para: ${status}`,
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
        return {
          message: `No se envió el correo. Falta plantilla para el estado: ${status}`,
        };
      }

      this.logger.log(`Cargando plantilla desde: ${templatePath}`);
      const html = this.compileTemplate(
        templatePath,
        this.buildTemplateData(transaction),
      );

      // ------- NUEVO: Determinar destinatario con fallback -------
      const candidateEmails: Array<string | undefined> = [
        transaction?.senderAccount?.createdBy
      ];

      const normalize = (s?: string) =>
        typeof s === 'string' ? s.trim().toLowerCase() : undefined;
      const isValidEmail = (s?: string) =>
        typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

      let recipient: string | undefined;
      for (const c of candidateEmails) {
        const n = normalize(c);
        if (isValidEmail(n)) {
          recipient = n;
          break;
        }
      }

      if (!recipient) {
        this.logger.warn(
          `No se encontró un destinatario válido para la transacción ${transaction?.id}. candidateEmails: ${JSON.stringify(candidateEmails)}`,
        );
        // No lanzamos error; devolvemos info para que el flujo admin no rompa.
        return {
          message: `No se envió el correo. No se detectó un email válido para la transacción ${transaction?.id}`,
        };
      }
      // -----------------------------------------------------------

      const mailOptions = {
        from,
        to: recipient,
        subject: selected.subject,
        html,
        envelope: { from, to: [recipient] }, // explícito para evitar problemas en nodemailer
      };

      this.logger.log(
        `Enviando correo desde ${from} a ${recipient} (tx=${transaction?.id})`,
      );
      try {
        const result = await this.mailer.sendMail(mailOptions);
        this.logger.log('Correo enviado exitosamente:', result);
        return {
          message: `El correo de estado ha sido enviado a ${recipient}`,
          result,
        };
      } catch (sendErr: any) {
        this.logger.error(
          `Error al enviar correo (sendMail) a ${recipient}: ${sendErr?.message ?? sendErr}`,
        );
        // No relanzar para no romper proceso admin; devolver info.
        return {
          message: `Error enviando correo a ${recipient}`,
          error: sendErr?.message ?? sendErr,
        };
      }
    } catch (error: any) {
      this.logger.error(
        `Error al procesar sendStatusEmail: ${error?.message ?? error}`,
      );
      // Devolver info (no relanzar) para evitar que el flujo admin se caiga por un mail faltante.
      return {
        message: `Error interno en MailerService`,
        error: error?.message ?? error,
      };
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
}
