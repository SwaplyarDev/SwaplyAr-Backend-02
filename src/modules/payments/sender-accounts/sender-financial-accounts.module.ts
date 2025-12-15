import { Module } from '@nestjs/common';
import { SenderFinancialAccountsService } from './sender-financial-accounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SenderFinancialAccount } from './entities/sender-financial-account.entity';
import { PaymentProvidersModule } from '../payment-providers/payment-providers.module';

@Module({
  imports: [TypeOrmModule.forFeature([SenderFinancialAccount]), PaymentProvidersModule],
  controllers: [],
  providers: [SenderFinancialAccountsService],
  exports: [SenderFinancialAccountsService],
})
export class SenderFinancialAccountsModule {}
