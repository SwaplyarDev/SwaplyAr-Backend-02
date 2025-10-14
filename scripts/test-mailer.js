import { ConfigService } from '@nestjs/config';
import { MailerService } from '../src/modules/mailer/mailer.service';

(async () => {
  const configService = new ConfigService();
  const mailerService = new MailerService(configService);

  try {
    console.log('Verificando conexión con el servidor SMTP...');
    await mailerService.mailer.verify();
    console.log('Conexión exitosa con el servidor SMTP.');

    console.log('Enviando correo de prueba...');
    await mailerService.sendAuthCodeMail(
      'correo-de-prueba@ejemplo.com',
      {
        NAME: 'Usuario de Prueba',
        VERIFICATION_CODE: '123456',
        BASE_URL: 'https://swaplyar.com',
        EXPIRATION_MINUTES: 15,
      },
      'login',
    );
    console.log('Correo enviado exitosamente.');
  } catch (error) {
    console.error('Error durante la prueba del servicio de correo:', error.message);
  }
})();
