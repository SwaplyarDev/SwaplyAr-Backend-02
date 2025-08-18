import { registerAs } from '@nestjs/config';

export default registerAs('otp', () => {
  const jwtSecret = process.env.OTP_JWT_SECRET;

  if (process.env.NODE_ENV === 'production' && !jwtSecret) {
    throw new Error('Missing OTP_JWT_SECRET in environment variables');
  }

  return {
    jwtSecret: jwtSecret || 'supersecret',
    ttl: parseInt(process.env.OTP_TTL || '300', 10),
  };
});
