import { registerAs } from '@nestjs/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export default registerAs('nodemailer', (): SMTPTransport.Options => {
  return {
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  };
});
