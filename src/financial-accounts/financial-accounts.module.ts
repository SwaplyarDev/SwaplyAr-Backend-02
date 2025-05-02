import { Module } from '@nestjs/common';
import { SenderFinancialAccountsModule } from './sender-financial-accounts/sender-financial-accounts.module';
import { ReceiverFinancialAccountsModule } from './receiver-financial-accounts/receiver-financial-accounts.module'; 
import { ProofOfPaymentsModule } from './proof-of-payments/proof-of-payments.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';

@Module({
  controllers: [],
  providers: [],
  imports: [SenderFinancialAccountsModule, ReceiverFinancialAccountsModule, ProofOfPaymentsModule, PaymentMethodModule],
})
export class FinancialAccountsModule {}
