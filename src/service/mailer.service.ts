/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as sgTransport from 'nodemailer-sendgrid-transport';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { AdminStatus } from 'src/enum/admin-status.enum';
import Handlebars from 'handlebars';

@Injectable()
export class MailerService {
  private readonly mailer: Transporter;
  private readonly logger = new Logger(MailerService.name);

  constructor(private readonly configService: ConfigService) {
    this.logger.log('Initializing MailerService...');
    const sendgridApiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (sendgridApiKey) {
      this.logger.log('Usando SendGrid como transport de correo');
      this.mailer = createTransport(
        sgTransport({
          auth: {
            api_key: sendgridApiKey,
          },
        })
      );
    } else {
      this.logger.log('Usando SMTP tradicional como transport de correo');
      this.mailer = createTransport(configService.get<SMTPTransport.Options>('nodemailer'));
    }
    this.logger.log('MailerService initialized.');
  }

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
    this.logger.log(`sendAuthCodeMail called with to=${to}, mailType=${mailType}`);
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
      this.logger.log('Verifying mailer...');
      await this.mailer.verify();
      this.logger.log('Mailer verification: OK');
    } catch (err: any) {
      this.logger.warn(`Mailer verification failed: ${err?.message ?? err}`);
    }

    const subject =
      mailType === 'register' ? 'Bienvenido a SwaplyAr' : 'Código de inicio de sesión';

    if (typeof payload === 'string') {
      this.logger.log('Sending plain text email...');
      await this.mailer.sendMail({ from, to, subject, text: payload });
      this.logger.log('Plain text email sent.');
      return { message: `The code has been sent to the email ${to}` };
    }

    const templateFiles =
      mailType === 'register'
        ? [
            { file: 'welcome_verification_code.hbs', subject: 'Bienvenido a SwaplyAr' },
            { file: 'plus_rewards_welcome.hbs', subject: 'Tus beneficios SwaplyAr Plus Rewards' },
          ]
        : [{ file: 'login_verification_code.hbs', subject: 'Código de inicio de sesión' }];

    for (const template of templateFiles) {
      this.logger.log(`Processing template: ${template.file}`);
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
        this.logger.log(`Compiling template at path: ${templatePath}`);
        const html = this.compileTemplate(templatePath, payload);
        this.logger.log('Template compiled successfully. Sending email...');
        await this.mailer.sendMail({ from, to, subject: template.subject, html });
        this.logger.log('Templated email sent successfully.');
      } catch (error: any) {
        this.logger.error(`Error sending templated mail (${template.file}): ${error.message}`);
        throw error;
      }
    }
  }

  async sendStatusEmail(transaction: any, status: AdminStatus) {
    this.logger.log(
      `sendStatusEmail called with transactionId=${transaction?.id}, status=${status}`,
    );
    try {
      const config = this.configService.get('nodemailer');
      const from = config?.auth?.user;

      if (!from || !config?.auth?.pass) {
        this.logger.error(
          'Falta configuración del correo. Verifica las variables de entorno EMAIL_USER y EMAIL_PASS.',
        );
        return { message: 'Mailer no configurado correctamente' };
      }

      try {
        this.logger.log('Verifying mailer...');
        await this.mailer.verify();
        this.logger.debug('Mailer verification: OK');
      } catch (verifyErr: any) {
        this.logger.warn(
          `Mailer verification failed (continuando): ${verifyErr?.message ?? verifyErr}`,
        );
      }

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
        [AdminStatus.Cancelled]: {
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
        this.logger.warn(`No hay plantilla de correo definida para el estado: ${status}`);
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
        this.logger.warn(`No se encontró la plantilla en la ruta: ${templatePath}`);
        return {
          message: `No se envió el correo. Falta plantilla para el estado: ${status}`,
        };
      }

      this.logger.log(`Cargando plantilla desde: ${templatePath}`);
      const html = this.compileTemplate(templatePath, this.buildTemplateData(transaction));

      const candidateEmails: Array<string | undefined> = [transaction?.senderAccount?.createdBy];

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
        return {
          message: `No se envió el correo. No se detectó un email válido para la transacción ${transaction?.id}`,
        };
      }

      const mailOptions = {
        from,
        to: recipient,
        subject: selected.subject,
        html,
        envelope: { from, to: [recipient] },
      };

      this.logger.log(`Enviando correo desde ${from} a ${recipient} (tx=${transaction?.id})`);
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
        return {
          message: `Error enviando correo a ${recipient}`,
          error: sendErr?.message ?? sendErr,
        };
      }
    } catch (error: any) {
      this.logger.error(`Error al procesar sendStatusEmail: ${error?.message ?? error}`);
      return {
        message: `Error interno en MailerService`,
        error: error?.message ?? error,
      };
    }
  }

  private compileTemplate(templatePath: string, data: Record<string, any>): string {
    this.logger.log(`Compiling template at path: ${templatePath}`);
    try {
      const rawTemplate = readFileSync(templatePath, 'utf8');
      const compiled = Handlebars.compile(rawTemplate);
      this.logger.log('Template compiled successfully.');
      return compiled(data);
    } catch (error: any) {
      this.logger.error(`Error compiling template: ${error.message}`);
      throw error;
    }
  }

  private getPaymentMethodImg(method: string, currency: string): string {
    this.logger.log(`Fetching payment method image for method=${method}, currency=${currency}`);
    if (method === 'paypal') {
      return currency === 'USD'
        ? 'https://res.cloudinary.com/dwrhturiy/image/upload/v1725224913/paypal.big_phrzvb.png'
        : 'https://res.cloudinary.com/dwrhturiy/image/upload/v1726600628/paypal.dark_lgvm7j.png';
    }
    if (method === 'payoneer') {
      if (currency === 'USD')
        return 'https://res.cloudinary.com/dwrhturiy/image/upload/v1725224899/payoneer.usd.big_djd07t.png';
      if (currency === 'EUR')
        return 'https://res.cloudinary.com/dwrhturiy/image/upload/v1725224887/payoneer.eur.big_xxdjxd.png';
    }
    if (method === 'bank') {
      return 'https://res.cloudinary.com/dwrhturiy/image/upload/v1725223550/banco.medium_vy2eqp.webp';
    }
    if (method === 'wise') {
      if (currency === 'USD')
        return 'https://res.cloudinary.com/dwrhturiy/image/upload/v1725225432/wise.usd.big_yvnpez.png';
      if (currency === 'EUR')
        return 'https://res.cloudinary.com/dwrhturiy/image/upload/v1725225416/wise.eur.big_etdolw.png';
    }
    if (method === 'tether') {
      return 'https://res.cloudinary.com/dwrhturiy/image/upload/v1745329683/TetherLight_jkyojt.png';
    }
    if (method === 'pix') {
      return 'https://res.cloudinary.com/dwrhturiy/image/upload/v1745329734/Pix1_lib603.png';
    }
    return '';
  }

  private buildTemplateData(transaction: any): Record<string, any> {
    this.logger.log(`Building template data for transactionId=${transaction?.id}`);
    const sender = transaction.senderAccount ?? {};
    const receiver = transaction.receiverAccount ?? {};
    const amount = transaction.amount ?? {};

    return {
      REFERENCE_NUMBER: transaction.id?.slice(0, 8)?.toUpperCase() ?? '',
      MODIFICATION_DATE: new Date().toLocaleDateString('es-AR'),
      NAME: sender.firstName ?? '',
      LAST_NAME: sender.lastName ?? '',
      TRANSACTION_ID: transaction.id,
      BASE_URL: this.configService.get('frontendBaseUrl') ?? 'https://swaplyar.com',
      DATE_HOUR: new Date().toLocaleString('es-AR'),
      PHONE_NUMBER: sender.phoneNumber ?? receiver.phoneNumber ?? '',
      AMOUNT_SENT: amount.amountSent ?? 0,
      SENT_CURRENCY: amount.currencySent ?? '',
      AMOUNT_RECEIVED: amount.amountReceived ?? 0,
      RECEIVED_CURRENCY: amount.currencyReceived ?? '',
      PAYMENT_METHOD: sender.paymentMethod?.method ?? 'No especificado',
      RECEIVED_NAME: `${receiver.firstName ?? ''} ${receiver.lastName ?? ''}`,
      PAYMENT_METHOD_IMG: this.getPaymentMethodImg(
        sender.paymentMethod?.method ?? '',
        amount.currencySent ?? '',
      ),
      PAYMENT_RECEIVED_IMG: this.getPaymentMethodImg(
        receiver.paymentMethod?.method ?? '',
        amount.currencyReceived ?? '',
      ),
    };
  }
}
