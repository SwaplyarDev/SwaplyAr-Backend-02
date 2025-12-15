import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { SenderFinancialAccount } from 'src/modules/payments/sender-accounts/entities/sender-financial-account.entity';
import { FinancialAccountsModule } from '../payments/financial-accounts/financial-accounts.module';
import { AmountsService } from './amounts/amounts.service';
import { Amount } from './amounts/entities/amount.entity';
import { ProofOfPaymentsService } from 'src/modules/payments/proof-of-payments/proof-of-payments.service';
import { FileUploadService } from '../file-upload/file-upload.service';
import { ProofOfPayment } from 'src/modules/payments/proof-of-payments/entities/proof-of-payment.entity';
import { CloudinaryService } from 'src/service/cloudinary/cloudinary.service';
import { AdministracionStatusLog } from '@admin/entities/administracion-status-log.entity';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@mailer/mailer.module';
import { UserDiscount } from '../discounts/entities/user-discount.entity';
import { TransactionUserDiscounts } from './entities/transaction-user-discounts.entity';
import { SenderFinancialAccountsModule } from '../payments/sender-accounts/sender-financial-accounts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      SenderFinancialAccount,
      Amount,
      UserDiscount,
      ProofOfPayment,
      AdministracionStatusLog,
      TransactionUserDiscounts,
    ]),
    SenderFinancialAccountsModule,
    FinancialAccountsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '60s' },
    }),
    MailerModule,
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    AmountsService,
    ProofOfPaymentsService,
    FileUploadService,
    CloudinaryService,
  ],
  exports: [
    TransactionsService,
    AmountsService,
    ProofOfPaymentsService,
    FileUploadService,
    CloudinaryService,
    TypeOrmModule, 
  ],
})
export class TransactionsModule {}
