import { Module } from '@nestjs/common';
import { SenderFinancialAccountsModule } from './sender-financial-accounts/sender-financial-accounts.module';
import { ReceiverFinancialAccountsModule } from './receiver-financial-accounts/receiver-financial-accounts.module';
import { ProofOfPaymentsModule } from './proof-of-payments/proof-of-payments.module';
import { PaymentMethodModule } from './payment-methods/payment-method.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialAccount } from '@financial-accounts/entities/financial-account.entity';

@Module({
  controllers: [],
  providers: [],
  imports: [
    TypeOrmModule.forFeature([FinancialAccount]),
    SenderFinancialAccountsModule,
    ReceiverFinancialAccountsModule,
    ProofOfPaymentsModule,
    PaymentMethodModule,
  ],
})
export class FinancialAccountsModule {}
