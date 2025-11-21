// /src/database/data-source.ts
import 'dotenv/config';
import { DataSource } from 'typeorm';

const isProd = process.env.NODE_ENV === 'production';
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('Falta DATABASE_URL.');
}

// Desactivar SSL cuando usamos el postgres local en Docker
const usesLocalDockerPostgres = databaseUrl.includes('postgres://postgres:admin@postgres:5432');

const ssl =
  isProd && !usesLocalDockerPostgres
    ? { rejectUnauthorized: false }
    : false;

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  ssl,
  synchronize: false,
  migrationsTableName: 'migrations',
  entities: [isProd ? 'dist/**/*.entity.js' : 'src/**/*.entity.ts'],
  migrations: [isProd ? 'dist/database/migrations/*.js' : 'src/database/migrations/*.ts'],
});
