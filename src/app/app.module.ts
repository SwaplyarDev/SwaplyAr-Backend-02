import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@config/config.module';
import typeormConfig from '@config/typeorm.config';
import { UsersModule } from '@users/users.module';
import { TransactionsModule } from '@transactions/transactions.module';
import { FinancialAccountsModule } from '@financial-accounts/financial-accounts.module';
import { AuthModule } from '@auth/auth.module';
import { MailerModule } from '@mailer/mailer.module';
import { FileUploadModule } from 'src/modules/file-upload/file-upload.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync(typeormConfig.asProvider()),
    UsersModule,
    TransactionsModule,
    FinancialAccountsModule,
    MailerModule,
    AuthModule,
    FileUploadModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
