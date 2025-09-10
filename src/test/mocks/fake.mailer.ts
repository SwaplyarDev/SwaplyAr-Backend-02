export interface SentMail {
  to: string;
  subject?: string;
  text?: string;
  html?: string;
}

export class FakeMailerService {
  public sentMails: SentMail[] = [];

  sendMail(mail: SentMail) {
    this.sentMails.push(mail);
    return { success: true };
  }

  // ✅ Agregar la función que tu app realmente llama
  sendAuthCodeMail(to: string, code: string) {
    this.sentMails.push({
      to,
      subject: 'Código de autenticación',
      text: `Tu código es: ${code}`,
    });
    return { success: true };
  }

  clear() {
    this.sentMails = [];
  }
}
