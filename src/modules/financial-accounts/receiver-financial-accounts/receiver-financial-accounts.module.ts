import { Module } from '@nestjs/common';
import { ReceiverFinancialAccountsService } from './receiver-financial-accounts.service';
import { ReceiverFinancialAccountsController } from './receiver-financial-accounts.controller';

@Module({
  controllers: [ReceiverFinancialAccountsController],
  providers: [ReceiverFinancialAccountsService],
})
export class ReceiverFinancialAccountsModule {}
