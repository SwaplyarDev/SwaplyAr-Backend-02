import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs('typeorm', (): TypeOrmModuleOptions => {
  const isProduction = process.env.NODE_ENV === 'production';

  console.log('dir: ', __dirname);
  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD,
    synchronize: true,
    entities: ['dist/**/*.entity.{ts,js}'],
    dropSchema: true,
  };
});
