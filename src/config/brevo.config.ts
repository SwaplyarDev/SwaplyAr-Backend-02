import { registerAs } from '@nestjs/config';

export default registerAs('brevo', () => ({
  apiKey: process.env.BREVO_API_KEY,
  emailFrom: process.env.EMAIL_FROM || 'no-reply@swaplyar.com',
}));
