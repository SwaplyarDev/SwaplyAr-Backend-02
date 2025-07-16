import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { SenderFinancialAccount } from '@financial-accounts/sender-financial-accounts/entities/sender-financial-account.entity';
import { ReceiverFinancialAccount } from '@financial-accounts/receiver-financial-accounts/entities/receiver-financial-account.entity';
import { FinancialAccountsModule } from '@financial-accounts/financial-accounts.module';
import { AmountsService } from './amounts/amounts.service';
import { Amount } from './amounts/entities/amount.entity';
import { ProofOfPaymentsService } from '@financial-accounts/proof-of-payments/proof-of-payments.service';
import { FileUploadService } from '../file-upload/file-upload.service';
import { ProofOfPayment } from '@financial-accounts/proof-of-payments/entities/proof-of-payment.entity';
import { CloudinaryService } from 'src/service/cloudinary/cloudinary.service';
import { UserDiscount } from '@users/entities/user-discount.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      SenderFinancialAccount,
      ReceiverFinancialAccount,
      Amount,
      UserDiscount,
      ProofOfPayment,
    ]),
    FinancialAccountsModule,
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
  ],
})
export class TransactionsModule {}
