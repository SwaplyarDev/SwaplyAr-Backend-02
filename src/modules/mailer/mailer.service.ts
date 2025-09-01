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
        ID?: string;
        NAME: string;
        VERIFICATION_CODE: string;
        BASE_URL: string;
        LOCATION?: string;
        EXPIRATION_MINUTES: number;
      },
    mailType?: 'register' | 'login',
  ) {
    const nodemailerConfig = this.configService.get<any>('nodemailer');
    const from =
      nodemailerConfig?.auth?.user ??
      this.configService.get<string>('EMAIL_USER') ??
      this.configService.get<string>('nodemailer.auth.user');

    if (!from) {
      this.logger.error(
        'Falta configuración del remitente. Verifica EMAIL_USER o nodemailer.auth.user.',
      );
      throw new Error('Missing email sender configuration.');
    }

    try {
      await this.mailer.verify();
      this.logger.log('Mailer verification: OK');
    } catch (err: any) {
      this.logger.warn(`Mailer verification failed: ${err?.message ?? err}`);
    }

    const subject =
      mailType === 'register' ? 'Bienvenido a SwaplyAr' : 'Código de inicio de sesión';

    if (typeof payload === 'string') {
      await this.mailer.sendMail({ from, to, subject, text: payload });
      return { message: `The code has been sent to the email ${to}` };
    }

    // Plantillas según mailType
    const templateFiles =
      mailType === 'register'
        ? [
          { file: 'welcome_verification_code.hbs', subject: 'Bienvenido a SwaplyAr' },
          { file: 'plus_rewards_welcome.hbs', subject: 'Tus beneficios SwaplyAr Plus Rewards' },
        ]
        : [{ file: 'login_verification_code.hbs', subject: 'Código de inicio de sesión' }];

    for (const template of templateFiles) {
      const templateRelativeParts: string[] = [
        'modules',
        'mailer',
        'templates',
        'email',
        'auth',
        template.file,
      ];

      const templatePathDev = join(process.cwd(), 'src', ...templateRelativeParts);
      const templatePathDist = join(__dirname, '..', '..', '..', ...templateRelativeParts);

      let templatePath = '';
      if (existsSync(templatePathDev)) {
        templatePath = templatePathDev;
      } else if (existsSync(templatePathDist)) {
        templatePath = templatePathDist;
      } else {
        this.logger.warn(
          `No se encontró la plantilla (${template.file}). Enviando fallback con texto.`,
        );
        await this.mailer.sendMail({
          from,
          to,
          subject: template.subject,
          text: `Tu código de verificación es: ${payload.VERIFICATION_CODE}`,
        });
        continue;
      }

      try {
        const html = this.compileTemplate(templatePath, payload);
        await this.mailer.sendMail({ from, to, subject: template.subject, html });
      } catch (error: any) {
        this.logger.error(`Error sending templated mail (${template.file}): ${error.message}`);
        throw error;
      }
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
      const statusTemplates: Record<AdminStatus, { subject: string; path: string }> = {
        [AdminStatus.Pending]: {
          subject: 'Transacción Pendiente',
          path: 'pending.hbs',
        },
        [AdminStatus.ReviewPayment]: {
          subject: 'Transacción en Revisión de Pago',
          path: 'review-payment.hbs',
        },
        [AdminStatus.Approved]: {
          subject: 'Transacción Aprobada',
          path: 'approved.hbs',
        },
        [AdminStatus.Rejected]: {
          subject: 'Transacción Rechazada',
          path: 'reject.hbs',
        },
        [AdminStatus.RefundInTransit]: {
          subject: 'Reembolso en Tránsito',
          path: 'refund-in-transit.hbs',
        },
        [AdminStatus.InTransit]: {
          subject: 'Transacción en Tránsito',
          path: 'in-transit.hbs',
        },
        [AdminStatus.Discrepancy]: {
          subject: 'Discrepancia en la Transacción',
          path: 'discrepancy.hbs',
        },
        [AdminStatus.Canceled]: {
          subject: 'Transacción Cancelada',
          path: 'canceled.hbs',
        },
        [AdminStatus.Modified]: {
          subject: 'Transacción Modificada',
          path: 'modified.hbs',
        },
        [AdminStatus.Refunded]: {
          subject: 'Transacción Reembolsada',
          path: 'refunded.hbs',
        },
        [AdminStatus.Completed]: {
          subject: 'Transacción Completada',
          path: 'completed.hbs',
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

  /**
 * Devuelve la URL de la imagen según método y moneda
 */
  private getPaymentMethodImg(paymentMethod: string, currency: string): string {
    if (paymentMethod === 'paypal') {
      return currency === 'USD'
        ? 'https://res.cloudinary.com/dwrhturiy/image/upload/v1725224913/paypal.big_phrzvb.png'
        : 'https://res.cloudinary.com/dwrhturiy/image/upload/v1726600628/paypal.dark_lgvm7j.png';
    }
    if (paymentMethod === 'payoneer') {
      if (currency === 'USD')
        return 'https://res.cloudinary.com/dwrhturiy/image/upload/v1725224899/payoneer.usd.big_djd07t.png';
      if (currency === 'EUR')
        return 'https://res.cloudinary.com/dwrhturiy/image/upload/v1725224887/payoneer.eur.big_xxdjxd.png';
    }
    if (paymentMethod === 'bank') {
      return 'https://res.cloudinary.com/dwrhturiy/image/upload/v1725223550/banco.medium_vy2eqp.webp';
    }
    if (paymentMethod === 'wise') {
      if (currency === 'USD')
        return 'https://res.cloudinary.com/dwrhturiy/image/upload/v1725225432/wise.usd.big_yvnpez.png';
      if (currency === 'EUR')
        return 'https://res.cloudinary.com/dwrhturiy/image/upload/v1725225416/wise.eur.big_etdolw.png';
    }
    if (paymentMethod === 'tether') {
      return 'https://res.cloudinary.com/dwrhturiy/image/upload/v1745329683/TetherLight_jkyojt.png';
    }
    if (paymentMethod === 'pix') {
      return 'https://res.cloudinary.com/dwrhturiy/image/upload/v1745329734/Pix1_lib603.png';
    }
    return '';
  }

  private getPaymentReceivedImg(paymentMethod: string, currency: string): string {
    if (paymentMethod === 'paypal') {
      return currency === 'USD'
        ? 'https://res.cloudinary.com/dwrhturiy/image/upload/v1725224913/paypal.big_phrzvb.png'
        : 'https://res.cloudinary.com/dwrhturiy/image/upload/v1726600628/paypal.dark_lgvm7j.png';
    }
    if (paymentMethod === 'payoneer') {
      if (currency === 'USD') return 'https://res.cloudinary.com/dwrhturiy/image/upload/v1725224899/payoneer.usd.big_djd07t.png';
      if (currency === 'EUR') return 'https://res.cloudinary.com/dwrhturiy/image/upload/v1725224887/payoneer.eur.big_xxdjxd.png';
    }
    if (paymentMethod === 'bank') {
      return 'https://res.cloudinary.com/dwrhturiy/image/upload/v1725223550/banco.medium_vy2eqp.webp';
    }
    if (paymentMethod === 'wise') {
      if (currency === 'USD') return 'https://res.cloudinary.com/dwrhturiy/image/upload/v1725225432/wise.usd.big_yvnpez.png';
      if (currency === 'EUR') return 'https://res.cloudinary.com/dwrhturiy/image/upload/v1725225416/wise.eur.big_etdolw.png';
    }
    if (paymentMethod === 'tether') {
      return 'https://res.cloudinary.com/dwrhturiy/image/upload/v1745329683/TetherLight_jkyojt.png';
    }
    if (paymentMethod === 'pix') {
      return 'https://res.cloudinary.com/dwrhturiy/image/upload/v1745329734/Pix1_lib603.png';
    }
    return '';
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
      subject: 'Transaccion en curso',
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

    const receiverPaymentMethod = receiver.paymentMethod?.method ?? '';
    const receiverCurrency = amount.currencyReceived ?? '';

    const paymentMethod = sender.paymentMethod?.method ?? '';
    const currency = amount.currencySent ?? '';

    return {
      REFERENCE_NUMBER: transaction.id?.slice(0, 8)?.toUpperCase() ?? '',
      TRANSACTION_ID: transaction.id,
      NAME: sender.firstName ?? '',
      LAST_NAME: sender.lastName ?? '',
      PHONE_NUMBER: sender.phoneNumber ?? receiver.phoneNumber ?? '',
      AMOUNT_SENT: amount.amountSent ?? 0,
      SENT_CURRENCY: amount.currencySent ?? '',
      DOCUMENT_NUMBER: sender.paymethod?.document_value ?? '',
      PAYMENT_METHOD: paymentMethod || 'No especificado',
      PAYMENT_RECEIVED_IMG: this.getPaymentReceivedImg(receiverPaymentMethod, receiverCurrency),
      PAYMENT_METHOD_IMG: this.getPaymentMethodImg(sender.paymentMethod?.method ?? '', transaction.amount?.currencySent ?? ''),
      //PAYMENT_METHOD: sender.paymentMethod?.method ?? 'No especificado',
      AMOUNT_RECEIVED: amount.amountReceived ?? 0,
      RECEIVED_CURRENCY: amount.currencyReceived ?? '',
      RECEIVED_NAME: receiver.firstName ?? 'No especificado',
      BASE_URL: this.configService.get('frontendBaseUrl') ?? 'https://swaplyar.com',
      DATE_HOUR: new Date().toLocaleString('es-AR'),
      MODIFICATION_DATE: new Date().toLocaleDateString('es-AR'),


      //PAYMENT_METHOD_IMG: this.getPaymentMethodImg(paymentMethod, currency),
    };
  }



}
