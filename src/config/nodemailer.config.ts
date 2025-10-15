import { registerAs } from '@nestjs/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export default registerAs('nodemailer', (): SMTPTransport.Options => {
  const port = Number(process.env.EMAIL_PORT) || 587;
  let secure = false;
  // Si el puerto es 465, secure debe ser true
  if (port === 465) secure = true;
  return {
    host: process.env.EMAIL_HOST || 'smtp-relay.brevo.com',
    port,
    secure,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000,
    debug: true,
  };
});
