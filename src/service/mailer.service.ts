/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { AdminStatus } from 'src/enum/admin-status.enum';
import Handlebars from 'handlebars';

@Injectable()
export class MailerService {
  private readonly mailer: Transporter;
  private readonly logger = new Logger(MailerService.name);

  constructor(private readonly configService: ConfigService) {
    this.logger.log('Inicializando MailerService con Brevo SMTP...');
    this.mailer = createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
      secure: false, // STARTTLS en 587
    });
    this.logger.log('MailerService inicializado con Brevo SMTP.');
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
    const from = this.getFromAddress();
    try {
      this.logger.log('Verificando conexión SMTP...');
      await this.mailer.verify();
      this.logger.log('Conexión SMTP verificada: OK');
    } catch (err) {
      this.logger.warn(`Verificación SMTP fallida: ${MailerService.getErrorMessage(err)}`);
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
          text: `Tu código de verificación es: ${typeof payload === 'string' ? payload : payload.VERIFICATION_CODE}`,
        });
        continue;
      }

      try {
        this.logger.log(`Compiling template at path: ${templatePath}`);
        const html = this.compileTemplate(templatePath, payload);
        this.logger.log('Template compiled successfully. Sending email...');
        await this.mailer.sendMail({ from, to, subject: template.subject, html });
        this.logger.log('Templated email sent successfully.');
      } catch (error) {
        this.logger.error(
          `Error sending templated mail (${template.file}): ${MailerService.getErrorMessage(error)}`,
        );
        throw error;
      }
    }
  }
  /**
   * Obtiene el remitente de correo desde la configuración.
   * Lanza error si no está configurado.
   */
  private getFromAddress(): string {
    const from =
      this.configService.get<string>('EMAIL_FROM') ?? this.configService.get<string>('EMAIL_USER');
    if (!from) {
      this.logger.error('Falta configuración del remitente. Verifica EMAIL_FROM o EMAIL_USER.');
      throw new Error('Missing email sender configuration.');
    }
    return from;
  }

  async sendStatusEmail(transaction: any, status: AdminStatus) {
    const txId = MailerService.extractId(transaction);
    this.logger.log(`sendStatusEmail called with transactionId=${txId}, status=${status}`);
    try {
      const from =
        this.configService.get<string>('EMAIL_FROM') ??
        this.configService.get<string>('EMAIL_USER');
      const pass = this.configService.get<string>('EMAIL_PASS');
      if (!from || !pass) {
        this.logger.error(
          'Falta configuración del correo. Verifica EMAIL_FROM, EMAIL_USER y EMAIL_PASS.',
        );
        return { message: 'Mailer no configurado correctamente' };
      }

      try {
        this.logger.log('Verificando conexión SMTP...');
        await this.mailer.verify();
        this.logger.debug('Conexión SMTP verificada: OK');
      } catch (verifyErr) {
        this.logger.warn(
          `Verificación SMTP fallida (continuando): ${MailerService.getErrorMessage(verifyErr)}`,
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

      const candidateEmails: Array<string | undefined> = [
        MailerService.extractSenderEmail(transaction),
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
        const txId = MailerService.extractId(transaction);
        this.logger.warn(
          `No se encontró un destinatario válido para la transacción ${txId}. candidateEmails: ${JSON.stringify(candidateEmails)}`,
        );
        return {
          message: `No se envió el correo. No se detectó un email válido para la transacción ${txId}`,
        };
      }

      const mailOptions = {
        from,
        to: recipient,
        subject: selected.subject,
        html,
        envelope: { from, to: [recipient] },
      };

      this.logger.log(
        `Enviando correo desde ${from} a ${recipient} (tx=${MailerService.extractId(transaction)})`,
      );
      try {
        const result = await this.mailer.sendMail(mailOptions);
        this.logger.log('Correo enviado exitosamente:', result);
        return {
          message: `El correo de estado ha sido enviado a ${recipient}`,
          result,
        };
      } catch (sendErr) {
        this.logger.error(
          `Error al enviar correo (sendMail) a ${recipient}: ${MailerService.getErrorMessage(sendErr)}`,
        );
        return {
          message: `Error enviando correo a ${recipient}`,
          error: MailerService.getErrorMessage(sendErr),
        };
      }
    } catch (error) {
      this.logger.error(
        `Error al procesar sendStatusEmail: ${MailerService.getErrorMessage(error)}`,
      );
      return {
        message: `Error interno en MailerService`,
        error: MailerService.getErrorMessage(error),
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
    } catch (error) {
      this.logger.error(`Error compiling template: ${MailerService.getErrorMessage(error)}`);
      throw error;
    }
  }

  private static getErrorMessage(error: unknown): string {
    if (typeof error === 'string') return error;
    if (
      error &&
      typeof error === 'object' &&
      'message' in error &&
      typeof (error as any).message === 'string'
    ) {
      return (error as any).message;
    }
    return JSON.stringify(error);
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
    const txId = MailerService.extractId(transaction);
    this.logger.log(`Building template data for transactionId=${txId}`);
    const sender = MailerService.extractSender(transaction) as {
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      paymentMethod?: { method?: string };
    };
    const receiver = MailerService.extractReceiver(transaction) as {
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      paymentMethod?: { method?: string };
    };
    const amount = MailerService.extractAmount(transaction) as {
      amountSent?: number;
      currencySent?: string;
      amountReceived?: number;
      currencyReceived?: string;
    };

    return {
      REFERENCE_NUMBER: typeof txId === 'string' ? txId.slice(0, 8)?.toUpperCase() : '',
      MODIFICATION_DATE: new Date().toLocaleDateString('es-AR'),
      NAME: typeof sender.firstName === 'string' ? sender.firstName : '',
      LAST_NAME: typeof sender.lastName === 'string' ? sender.lastName : '',
      TRANSACTION_ID: txId,
      BASE_URL: this.configService.get('frontendBaseUrl') ?? 'https://swaplyar.com',
      DATE_HOUR: new Date().toLocaleString('es-AR'),
      PHONE_NUMBER:
        typeof sender.phoneNumber === 'string'
          ? sender.phoneNumber
          : typeof receiver.phoneNumber === 'string'
            ? receiver.phoneNumber
            : '',
      AMOUNT_SENT: typeof amount.amountSent === 'number' ? amount.amountSent : 0,
      SENT_CURRENCY: typeof amount.currencySent === 'string' ? amount.currencySent : '',
      AMOUNT_RECEIVED: typeof amount.amountReceived === 'number' ? amount.amountReceived : 0,
      RECEIVED_CURRENCY: typeof amount.currencyReceived === 'string' ? amount.currencyReceived : '',
      PAYMENT_METHOD:
        typeof sender.paymentMethod === 'object' &&
        sender.paymentMethod &&
        typeof sender.paymentMethod.method === 'string'
          ? sender.paymentMethod.method
          : 'No especificado',
      RECEIVED_NAME:
        `${typeof receiver.firstName === 'string' ? receiver.firstName : ''} ${typeof receiver.lastName === 'string' ? receiver.lastName : ''}`.trim(),
      PAYMENT_METHOD_IMG: this.getPaymentMethodImg(
        typeof sender.paymentMethod === 'object' &&
          sender.paymentMethod &&
          typeof sender.paymentMethod.method === 'string'
          ? sender.paymentMethod.method
          : '',
        typeof amount.currencySent === 'string' ? amount.currencySent : '',
      ),
      PAYMENT_RECEIVED_IMG: this.getPaymentMethodImg(
        typeof receiver.paymentMethod === 'object' &&
          receiver.paymentMethod &&
          typeof receiver.paymentMethod.method === 'string'
          ? receiver.paymentMethod.method
          : '',
        typeof amount.currencyReceived === 'string' ? amount.currencyReceived : '',
      ),
    };
  }

  /**
   * Métodos utilitarios para acceso seguro a propiedades de transaction
   */
  private static extractId(transaction: any): string {
    if (
      transaction &&
      typeof transaction === 'object' &&
      'id' in transaction &&
      typeof transaction.id === 'string'
    ) {
      return transaction.id;
    }
    return '';
  }

  private static extractSenderEmail(transaction: any): string | undefined {
    if (
      transaction &&
      typeof transaction === 'object' &&
      'senderAccount' in transaction &&
      transaction.senderAccount &&
      typeof transaction.senderAccount === 'object' &&
      'createdBy' in transaction.senderAccount &&
      typeof transaction.senderAccount.createdBy === 'string'
    ) {
      return transaction.senderAccount.createdBy;
    }
    return undefined;
  }
  private static extractSender(transaction: any): any {
    if (
      transaction &&
      typeof transaction === 'object' &&
      'senderAccount' in transaction &&
      transaction.senderAccount &&
      typeof transaction.senderAccount === 'object'
    ) {
      return transaction.senderAccount;
    }
    return {};
  }

  private static extractReceiver(transaction: any): any {
    if (
      transaction &&
      typeof transaction === 'object' &&
      'receiverAccount' in transaction &&
      transaction.receiverAccount &&
      typeof transaction.receiverAccount === 'object'
    ) {
      return transaction.receiverAccount;
    }
    return {};
  }

  private static extractAmount(transaction: any): any {
    if (
      transaction &&
      typeof transaction === 'object' &&
      'amount' in transaction &&
      transaction.amount &&
      typeof transaction.amount === 'object'
    ) {
      return transaction.amount;
    }
    return {};
  }
}
