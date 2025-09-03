import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs('typeorm', (): TypeOrmModuleOptions => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL no definida en las variables de entorno');
  }

  const isProduction = process.env.NODE_ENV === 'production';

  return {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: isProduction
      ? { rejectUnauthorized: false } // SSL activado en producción
      : false, // SSL desactivado en desarrollo
    synchronize: false,
    entities: ['dist/**//**.entity.{ts,js}'],
    dropSchema: false,
  };
});
