// /src/config/typeorm.config.ts
import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export default registerAs('typeorm', (): TypeOrmModuleOptions => {
  // Si estamos en test usamos la URL de test; si no, la principal.
  // Si no existe DATABASE_URL (por ejemplo decides NO definirla y usar solo variables sueltas),
  // construimos una a partir de POSTGRES_*.
  const isTestEnv = process.env.NODE_ENV === 'test';
  let databaseUrl = isTestEnv ? process.env.DATABASE_TEST_URL : process.env.DATABASE_URL;

  if (!databaseUrl) {
    const user = isTestEnv ? process.env.POSTGRES_TEST_USER : process.env.POSTGRES_USER;
    const pass = isTestEnv ? process.env.POSTGRES_TEST_PASSWORD : process.env.POSTGRES_PASSWORD;
    const host = isTestEnv ? 'localhost' : process.env.DATABASE_HOST || 'localhost';
    const port = isTestEnv ? process.env.POSTGRES_TEST_PORT : process.env.POSTGRES_PORT || '5432';
    const db = isTestEnv ? process.env.POSTGRES_TEST_DB : process.env.POSTGRES_DB;
    if (!user || !pass || !db) {
      throw new Error('No se pudo construir la DATABASE_URL: faltan variables POSTGRES_*');
    }
    databaseUrl = `postgres://${user}:${pass}@${host}:${port}/${db}`;
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const isTest = isTestEnv;
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
