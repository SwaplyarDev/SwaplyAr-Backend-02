import { registerAs } from '@nestjs/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export default registerAs('nodemailer', (): SMTPTransport.Options => {
  return {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000,
    debug: true,
  };
});
