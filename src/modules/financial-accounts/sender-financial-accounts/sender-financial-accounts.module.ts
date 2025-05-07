import { Module } from '@nestjs/common';
import { SenderFinancialAccountsService } from './sender-financial-accounts.service';
import { SenderFinancialAccountsController } from './sender-financial-accounts.controller';

@Module({
  controllers: [SenderFinancialAccountsController],
  providers: [SenderFinancialAccountsService],
})
export class SenderFinancialAccountsModule {}
