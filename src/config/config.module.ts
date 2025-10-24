import { Module } from '@nestjs/common';
import { ConfigModule as Config } from '@nestjs/config';
import typeormConfig from '@config/typeorm.config';
import brevoConfig from '@config/brevo.config';

@Module({
  imports: [
    Config.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV}.local`,
        '.env.local',
        `.env.${process.env.NODE_ENV}`,
        '.env',
      ],
      load: [typeormConfig, brevoConfig],
    }),
  ],
})
export class ConfigModule {}
