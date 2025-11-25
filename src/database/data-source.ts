// /src/database/data-source.ts
import 'dotenv/config';
import { DataSource } from 'typeorm';

const isProd = process.env.NODE_ENV === 'production';

// Usa DATABASE_URL (Heroku / Railway / Render). Si no existe, intenta armarla simple opcionalmente.
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('Falta DATABASE_URL (simplificado).');
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  ssl:  false,
  synchronize: false, // siempre migraciones, no sync
  migrationsTableName: 'migrations', // nombre estándar
  entities: [isProd ? 'dist/**/*.entity.js' : 'src/**/*.entity.ts'],
  migrations: [isProd ? 'dist/database/migrations/*.js' : 'src/database/migrations/*.ts'],
});
