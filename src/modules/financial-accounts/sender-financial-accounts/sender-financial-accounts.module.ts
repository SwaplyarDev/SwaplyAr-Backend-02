import { Module } from '@nestjs/common';
import { SenderFinancialAccountsService } from './sender-financial-accounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SenderFinancialAccount } from './entities/sender-financial-account.entity';
import { PaymentMethodModule } from '@financial-accounts/payment-methods/payment-method.module';

@Module({
  imports: [TypeOrmModule.forFeature([SenderFinancialAccount]), PaymentMethodModule],
  controllers: [],
  providers: [SenderFinancialAccountsService],
  exports: [SenderFinancialAccountsService],
})
export class SenderFinancialAccountsModule {}
