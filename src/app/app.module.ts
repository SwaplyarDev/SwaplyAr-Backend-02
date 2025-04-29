import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@config/config.module';
import typeormConfig from '@config/typeorm.config';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync(typeormConfig.asProvider()),
    UsersModule,

  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
