import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@config/config.module';
import typeormConfig from '@config/typeorm.config';
import { UsersModule } from '@users/users.module';
import { TransactionsModule } from '@transactions/transactions.module';
import { FinancialAccountsModule } from '@financial-accounts/financial-accounts.module';
import { FileUploadModule } from 'src/modules/file-upload/file-upload.module';
import { AdminModule } from '@admin/admin.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/common/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync(typeormConfig.asProvider()),
    UsersModule,
    TransactionsModule,
    FinancialAccountsModule,
    FileUploadModule,
    AdminModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'tu_clave_secreta',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AppController],
  providers: [JwtStrategy],
})
export class AppModule {}
