import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@config/config.module';
import typeormConfig from '@config/typeorm.config';
import { UsersModule } from '@users/users.module';
import { TransactionsModule } from '@transactions/transactions.module';
import { AuthModule } from '@auth/auth.module';
import { MailerModule } from '@mailer/mailer.module';
import { FileUploadModule } from 'src/modules/file-upload/file-upload.module';
import { UserAccountsModule } from 'src/modules/userAccounts/userAccounts.module';
import { RegretsModule } from '@transactions/regrets/regrets.module';
import { NotesModule } from '@transactions/notes/notes.module';
import { AdminModule } from '@admin/admin.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/common/jwt.strategy';
import { AbandonedTransactionsModule } from '@transactions/abandoned-transactions/abandoned-transactions.module';
import { OtpModule } from '@otp/otp.module';
import { UserVerificationModule } from '@users/verification/user-verification.module';
import { QuestionsModule } from '../modules/questions/questions.module';
import { ContactModule } from 'src/modules/contacts/contacts.module';
import { DiscountModule } from 'src/modules/discounts/discounts.module';
import { QualificationModule } from 'src/modules/qualifications/qualifications.module';
import { ConversionsModule } from 'src/modules/conversions/conversions.module';
import { CommissionsModule } from 'src/modules/conversions/commissions/commissions.module';
import { DynamicCommissionsModule } from 'src/modules/dynamic-commissions/dynamicCommissions.module';
import { PaymentPlatformsModule } from 'src/modules/payments/payment-platforms/payment-platform.module';
import { PaymentProvidersModule } from 'src/modules/payments/payment-providers/payment-providers.module';
import { BankAccountsModule } from 'src/modules/payments/accounts/bank-accounts/bank-accounts.module';
import { VirtualBankAccountsModule } from 'src/modules/payments/accounts/virtual-bank-accounts/virtual-bank-accounts.module';
import { CryptoAccountsModule } from 'src/modules/payments/accounts/crypto-accounts/crypto-accounts.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync(typeormConfig.asProvider()),
    UsersModule,
    TransactionsModule,
    FileUploadModule,
    UserAccountsModule,
    RegretsModule,
    NotesModule,
    OtpModule,
    MailerModule,
    AuthModule,
    AdminModule,
    AbandonedTransactionsModule,
    PassportModule,
    QuestionsModule,
    ContactModule,
    DiscountModule,
    UserVerificationModule,
    QualificationModule,
    ConversionsModule,
    CommissionsModule,
    DynamicCommissionsModule,
    PaymentPlatformsModule,
    PaymentProvidersModule,
    BankAccountsModule,
    VirtualBankAccountsModule,
    CryptoAccountsModule,

    JwtModule.register({
      secret: process.env.JWT_SECRET || 'tu_clave_secreta',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AppController],
  providers: [JwtStrategy],
})
export class AppModule {}
