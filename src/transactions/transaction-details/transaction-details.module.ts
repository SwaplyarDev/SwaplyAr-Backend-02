import { Module } from '@nestjs/common';
import { TransactionDetailsService } from './transaction-details.service';
import { TransactionDetailsController } from './transaction-details.controller';

@Module({
  controllers: [TransactionDetailsController],
  providers: [TransactionDetailsService],
})
export class TransactionDetailsModule {}
