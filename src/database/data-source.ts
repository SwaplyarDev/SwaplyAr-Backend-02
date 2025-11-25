// /src/database/data-source.ts
import 'dotenv/config';
import { DataSource } from 'typeorm';

const isProd = process.env.NODE_ENV === 'production';

// En todos los entornos usamos DATABASE_URL para mayor claridad.
// En local puedes definirla en .env apuntando a tu postgres.
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('Falta DATABASE_URL. Defínela en variables de entorno.');
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  ssl: false,
  synchronize: false,
  migrationsTableName: 'migrations',
  entities: [isProd ? 'dist/**/*.entity.js' : 'src/**/*.entity.ts'],
  migrations: [isProd ? 'dist/database/migrations/*.js' : 'src/database/migrations/*.ts'],
});
