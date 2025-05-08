import { Module } from '@nestjs/common';
import { SenderFinancialAccountsModule } from './sender-financial-accounts/sender-financial-accounts.module';
import { ReceiverFinancialAccountsModule } from './receiver-financial-accounts/receiver-financial-accounts.module';
import { ProofOfPaymentsModule } from './proof-of-payments/proof-of-payments.module';
import { PaymentMethodModule } from './payment-methods/payment-method.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialAccount } from '@financial-accounts/entities/financial-account.entity';
import { FinancialAccountController } from './financial-accounts.controller';
import { FinancialAccountsService } from './financial-accounts.service';
import { SenderFinancialAccount } from './sender-financial-accounts/entities/sender-financial-account.entity';
import { ReceiverFinancialAccount } from './receiver-financial-accounts/entities/receiver-financial-account.entity';

@Module({
  controllers: [FinancialAccountController],
  providers: [FinancialAccountsService],
  imports: [
    TypeOrmModule.forFeature([FinancialAccount,SenderFinancialAccount,ReceiverFinancialAccount]),
    SenderFinancialAccountsModule,
    ReceiverFinancialAccountsModule,
    ProofOfPaymentsModule,
    PaymentMethodModule,
  ],
})
export class FinancialAccountsModule {}
