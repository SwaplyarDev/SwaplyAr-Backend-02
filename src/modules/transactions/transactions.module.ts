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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      SenderFinancialAccount,
      ReceiverFinancialAccount,
      Amount
    ]),
    FinancialAccountsModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService,AmountsService],
})
export class TransactionsModule {}
