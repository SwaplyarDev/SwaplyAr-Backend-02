import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export default registerAs('typeorm', (): TypeOrmModuleOptions => {
  // Elegimos la URL según el entorno
  const databaseUrl =
    process.env.NODE_ENV === 'test' ? process.env.DATABASE_TEST_URL : process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL no definida en las variables de entorno');
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const isTest = process.env.NODE_ENV === 'test';
  const isCompiled = __filename.endsWith('.js'); // si estamos en dist

  return {
    type: 'postgres',
    url: databaseUrl,
    ssl: isProduction ? { rejectUnauthorized: false } : false, // SSL solo en producción
    // En producción no sincronizamos; en dev/test sí para iterar y e2e
    synchronize: !isProduction,
    // En test reiniciamos el esquema para pruebas limpias
    dropSchema: isTest,
    // Soporte para correr desde ts-node (src) y desde dist
    entities: [
      isCompiled
        ? join(__dirname, '/../**/*.entity.js') // producción (dist)
        : join(__dirname, '/../**/*.entity.ts'), // desarrollo/test (src)
    ],
  };
});
