import { Module } from '@nestjs/common';
import { PaymentAccountsService } from './payment-accounts.service';
import { PaymentAccountsController } from './payment-accounts.controller';

@Module({
  controllers: [PaymentAccountsController],
  providers: [PaymentAccountsService],
})
export class PaymentAccountsModule {}
