import { registerAs } from '@nestjs/config';

export default registerAs('otp', () => {
  // Permite usar tanto OTP_JWT_SECRET como OTP_SECRET para flexibilidad
  const jwtSecret = process.env.OTP_JWT_SECRET || process.env.OTP_SECRET;

  if (process.env.NODE_ENV === 'production' && !jwtSecret) {
    throw new Error('Missing OTP_JWT_SECRET (or OTP_SECRET) in environment variables');
  }

  return {
    jwtSecret: jwtSecret || 'supersecret', // Solo para desarrollo
    ttl: parseInt(process.env.OTP_TTL || '300', 10), // 5 minutos por defecto
  };
});
