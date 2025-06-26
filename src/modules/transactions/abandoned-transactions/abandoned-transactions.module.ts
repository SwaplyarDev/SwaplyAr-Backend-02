import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbandonedTransactionsController } from './abandoned-transactions.controller';
import { AbandonedTransactionsService } from './abandoned-transactions.service';
import { AbandonedTransaction } from '../entities/abandoned-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AbandonedTransaction])],
  controllers: [AbandonedTransactionsController],
  providers: [AbandonedTransactionsService],
  exports: [AbandonedTransactionsService],
})
export class AbandonedTransactionsModule {} 