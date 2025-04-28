import { Module } from '@nestjs/common';
import { ConfigModule as Config } from '@nestjs/config';
import typeormConfig from '@config/typeorm.config';

@Module({
  imports: [
    Config.forRoot({
      isGlobal: true,
      load: [typeormConfig],
    }),
  ],
})
export class ConfigModule {}
