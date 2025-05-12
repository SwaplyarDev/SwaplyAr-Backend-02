import { Module } from '@nestjs/common';
import { SenderFinancialAccountsService } from './sender-financial-accounts.service';
import { SenderFinancialAccountsController } from './sender-financial-accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SenderFinancialAccount } from './entities/sender-financial-account.entity';
import { PaymentMethodService } from '@financial-accounts/payment-methods/payment-method.service';
import { PaymentMethod } from '@financial-accounts/payment-methods/entities/payment-method.entity';
import { PaymentMethodModule } from '@financial-accounts/payment-methods/payment-method.module';

@Module({
  imports:[TypeOrmModule.forFeature([SenderFinancialAccount]),PaymentMethodModule],
  controllers: [SenderFinancialAccountsController],
  providers: [SenderFinancialAccountsService],
  exports: [SenderFinancialAccountsService],
})
export class SenderFinancialAccountsModule {}
