import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as process from 'node:process';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
  synchronize: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  dropSchema: true, // CUIDADO, NO UTILIZAR CON DB DE PRODUCCIÓN
};

export default registerAs('typeorm', () => typeormConfig);
