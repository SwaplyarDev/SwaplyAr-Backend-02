// /src/database/data-source.ts
import 'dotenv/config';
import { DataSource } from 'typeorm';

const isProd = process.env.NODE_ENV === 'production';

// Selección automática de URL según entorno
const databaseUrl = isProd
  ? process.env.DATABASE_URL_DOCKER || process.env.DATABASE_URL
  : process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL no encontrada.');
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  ssl: false,
  extra: { ssl: false }, // evita el error "server does not support SSL"
  synchronize: false,
  migrationsTableName: 'migrations',
  entities: [isProd ? 'dist/**/*.entity.js' : 'src/**/*.entity.ts'],
  migrations: [isProd ? 'dist/database/migrations/*.js' : 'src/database/migrations/*.ts'],
});
