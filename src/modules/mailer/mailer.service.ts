import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiClient, TransactionalEmailsApi } from 'sib-api-v3-sdk';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { AdminStatus } from 'src/enum/admin-status.enum';
import Handlebars from 'handlebars';

Handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private brevoClient: TransactionalEmailsApi;
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('brevo.apiKey');
    if (!apiKey) {
      this.logger.error('Falta la variable brevo.apiKey en la configuración.');
      throw new Error('Missing brevo.apiKey');
    }

    const defaultClient = ApiClient.instance;
    defaultClient.authentications['api-key'].apiKey = apiKey;

    this.brevoClient = new TransactionalEmailsApi();

    this.from = this.configService.get<string>('brevo.emailFrom') ?? '';
    if (!this.from) {
      this.logger.warn('No se encontró brevo.emailFrom en configuración.');
    }

    this.logger.log('MailerService inicializado con Brevo API.');
  }

  /** ===========================
   * AUTH EMAILS
   * =========================== */
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
    mailType: 'register' | 'login' = 'login',
  ) {
    const subject =
      mailType === 'register' ? 'Bienvenido a SwaplyAr' : 'Código de inicio de sesión';

    if (typeof payload === 'string') {
      await this.sendBrevoEmail({ to, subject, textContent: payload });
      return { message: `Código enviado a ${to}` };
    }

    const templates =
      mailType === 'register'
        ? ['welcome_verification_code.hbs', 'plus_rewards_welcome.hbs']
        : ['login_verification_code.hbs'];

    for (const file of templates) {
      const templatePath = this.resolveTemplatePath(['auth', file]);

      if (!templatePath) {
        this.logger.warn(`No se encontró la plantilla ${file}, usando texto plano.`);
        await this.sendBrevoEmail({
          to,
          subject,
          textContent: `Tu código de verificación es: ${payload.VERIFICATION_CODE}`,
        });
        continue;
      }

      try {
        const html = this.compileTemplate(templatePath, payload);
        await this.sendBrevoEmail({ to, subject, htmlContent: html });
      } catch (err: any) {
        this.logger.error(`Error al enviar plantilla ${file}: ${err.message}`);
      }
    }
  }

  /** ===========================
   * TRANSACTION STATUS EMAILS
   * =========================== */
  async sendStatusEmail(transaction: any, status: AdminStatus) {
    const templates: Record<AdminStatus, { subject: string; file: string }> = {
      [AdminStatus.Pending]: { subject: 'Transacción Pendiente', file: 'pending.hbs' },
      [AdminStatus.ReviewPayment]: {
        subject: 'Transacción en Revisión de Pago',
        file: 'review-payment.hbs',
      },
      [AdminStatus.Approved]: { subject: 'Transacción Aprobada', file: 'approved.hbs' },
      [AdminStatus.Rejected]: { subject: 'Transacción Rechazada', file: 'reject.hbs' },
      [AdminStatus.RefundInTransit]: {
        subject: 'Reembolso en Tránsito',
        file: 'refund-in-transit.hbs',
      },
      [AdminStatus.InTransit]: { subject: 'Transacción en Tránsito', file: 'in-transit.hbs' },
      [AdminStatus.Discrepancy]: {
        subject: 'Discrepancia en la Transacción',
        file: 'discrepancy.hbs',
      },
      [AdminStatus.Canceled]: { subject: 'Transacción Cancelada', file: 'canceled.hbs' },
      [AdminStatus.Modified]: { subject: 'Transacción Modificada', file: 'modified.hbs' },
      [AdminStatus.Refunded]: { subject: 'Transacción Reembolsada', file: 'refunded.hbs' },
      [AdminStatus.Completed]: { subject: 'Transacción Completada', file: 'completed.hbs' },
    };

    const selected = templates[status];
    if (!selected) {
      this.logger.warn(`No hay plantilla definida para el estado ${status}`);
      return { message: `Sin plantilla definida para: ${status}` };
    }

    const templatePath = this.resolveTemplatePath([
      'transaction',
      'operations_transactions',
      selected.file,
    ]);
    if (!templatePath) {
      this.logger.warn(`No se encontró plantilla para ${status}.`);
      return { message: `Falta plantilla para ${status}` };
    }

    const recipient = this.extractValidEmail(transaction);
    if (!recipient) {
      this.logger.warn(`Transacción ${transaction?.id}: sin email válido.`);
      return { message: 'No se encontró destinatario válido.' };
    }

    try {
      const html = this.compileTemplate(templatePath, this.buildTemplateData(transaction));
      const result = await this.sendBrevoEmail({
        to: recipient,
        subject: selected.subject,
        htmlContent: html,
      });
      this.logger.log(`Correo de estado enviado a ${recipient}`);
      return { message: `Correo enviado a ${recipient}`, result };
    } catch (error: any) {
      this.logger.error(`Error enviando correo a ${recipient}: ${error.message}`);
      return { message: 'Error al enviar correo', error: error.message };
    }
  }

  /** ===========================
   * REVIEW PAYMENT EMAIL
   * =========================== */
  async sendReviewPaymentEmail(to: string, transaction: any) {
    const context = this.buildReviewPaymentTemplateData(transaction);
    const templatePath = this.resolveTemplatePath([
      'transaction',
      'operations_transactions',
      'pending.hbs',
    ]);
    if (!templatePath) throw new Error('No se encontró plantilla pending.hbs');
    const html = this.compileTemplate(templatePath, context);

    await this.sendBrevoEmail({
      to,
      subject: 'Transacción en curso',
      htmlContent: html,
    });
  }

  /** ===========================
   * HELPERS
   * =========================== */
  private resolveTemplatePath(subdirs: string[]): string | null {
    const parts = ['modules', 'mailer', 'templates', 'email', ...subdirs];
    const devPath = join(process.cwd(), 'src', ...parts);
    const distPath = join(__dirname, '..', '..', '..', ...parts);
    if (existsSync(devPath)) return devPath;
    if (existsSync(distPath)) return distPath;
    return null;
  }

  private compileTemplate(templatePath: string, data: Record<string, any>): string {
    try {
      const raw = readFileSync(templatePath, 'utf8');
      return Handlebars.compile(raw)(data);
    } catch (err: any) {
      this.logger.error(`Error compilando plantilla ${templatePath}: ${err.message}`);
      throw err;
    }
  }

  private extractValidEmail(transaction: any): string | null {
    const candidates = [transaction?.senderAccount?.createdBy];
    const isEmail = (s?: string) => typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
    return candidates.find(isEmail) ?? null;
  }

  private async sendBrevoEmail({
    to,
    subject,
    htmlContent,
    textContent,
  }: {
    to: string;
    subject: string;
    htmlContent?: string;
    textContent?: string;
  }) {
    const email = {
      sender: { email: this.from },
      to: [{ email: to }],
      subject,
      ...(htmlContent ? { htmlContent } : {}),
      ...(textContent ? { textContent } : {}),
    };
    return this.brevoClient.sendTransacEmail(email);
  }

  private buildTemplateData(transaction: any): Record<string, any> {
    const sender = transaction.senderAccount ?? {};
    const receiver = transaction.receiverAccount ?? {};
    const amount = transaction.amount ?? {};

    const templateData = {
      REFERENCE_NUMBER: transaction.id?.slice(0, 8)?.toUpperCase() ?? '',
      TRANSACTION_ID: transaction.id,
      NAME: sender.firstName ?? '',
      LAST_NAME: sender.lastName ?? '',
      PHONE_NUMBER: sender.phoneNumber ?? receiver.phoneNumber ?? '',
      EMAIL: sender.createdBy ?? '',
      AMOUNT_SENT: amount.amountSent ?? 0,
      SENT_CURRENCY: amount.currencySent ?? '',
      PAYMENT_METHOD: sender.paymentMethod?.method ?? 'No especificado',      
      PAYMENT_METHOD_IMG: this.getPaymentMethodImg(
        sender.paymentMethod?.method ?? '',
        amount.currencySent ?? '',
      ),
      AMOUNT_RECEIVED: amount.amountReceived ?? 0,
      RECEIVED_CURRENCY: amount.currencyReceived ?? '',
      RECEIVED_NAME: `${receiver.firstName ?? ''} ${receiver.lastName ?? ''}`.trim(),
      RECEIVED_METHOD: receiver.paymentMethod?.method ?? 'No especificado',
      RECEIVED_METHOD_IMG: this.getPaymentMethodImg(
        receiver.paymentMethod?.method ?? '',
        amount.currencyReceived ?? '',
      ),
      BASE_URL: this.configService.get('frontendBaseUrl') ?? 'https://swaplyar.com',
      DATE_HOUR: new Date().toLocaleString('es-AR'),
      MODIFICATION_DATE: new Date().toLocaleDateString('es-AR'),
    };

    
    if (receiver.paymentMethod?.method === 'pix' || templateData.RECEIVED_METHOD_IMG ===
    'https://res.cloudinary.com/dwrhturiy/image/upload/v1752677907/layer1_dw5lwr.png') 
    {
      templateData['PIX_KEY'] = receiver.paymentMethod?.pixKey ?? '';
      templateData['CPF'] = receiver.paymentMethod?.cpf ?? '';
    }

    return templateData;
  }

  private buildReviewPaymentTemplateData(transaction: any): Record<string, any> {
    return this.buildTemplateData(transaction);
  }

  private getPaymentMethodImg(method: string, currency: string): string {
    const map: Record<string, string> = {
      paypal_usd:
        'https://res.cloudinary.com/dwrhturiy/image/upload/v1752677907/ppcom_1_qenolt.png',
      paypal_default:
        'https://res.cloudinary.com/dwrhturiy/image/upload/v1752677907/ppcom_1_1_kwexmd.png',
      payoneer_usd:
        'https://res.cloudinary.com/dwrhturiy/image/upload/v1752677904/Frame_14_1_co6gfi.png',
      payoneer_eur:
        'https://res.cloudinary.com/dwrhturiy/image/upload/v1752677981/Frame_14_3_ir23zl.png',
      bank_default:
        'https://res.cloudinary.com/dwrhturiy/image/upload/v1752677641/Frame_11_izy6ra.png',
      wise_usd:
        'https://res.cloudinary.com/dwrhturiy/image/upload/v1752677904/New_Wise_USD_Claro_f1dt7a.png',
      wise_eur:
        'https://res.cloudinary.com/dwrhturiy/image/upload/v1752677905/New_Wise_EUR_Claro_ckwcsi.png',
      tether_default:
        'https://res.cloudinary.com/dwrhturiy/image/upload/v1752677905/New_Tether_Claro_zxxqqz.png',
      pix_default: 'https://res.cloudinary.com/dwrhturiy/image/upload/v1752677907/layer1_dw5lwr.png',
    };
    return map[`${method}_${currency.toLowerCase()}`] ?? map[`${method}_default`] ?? '';
  }
}
