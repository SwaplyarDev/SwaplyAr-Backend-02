import { Module } from '@nestjs/common';
import { ReceiverFinancialAccountsService } from './receiver-financial-accounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceiverFinancialAccount } from './entities/receiver-financial-account.entity';
import { PaymentMethodModule } from 'src/deprecated/financial-accounts/payment-methods/payment-method.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReceiverFinancialAccount]), PaymentMethodModule],
  controllers: [],
  providers: [ReceiverFinancialAccountsService],
  exports: [ReceiverFinancialAccountsService],
})
export class ReceiverFinancialAccountsModule {}
