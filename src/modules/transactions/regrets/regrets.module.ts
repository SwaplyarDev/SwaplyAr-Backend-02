import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Regret } from './entities/regrets.entity';
import { RegretsService } from './regrets.service';
import { RegretsController } from './regrets.controller';
import { Transaction } from '@transactions/entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Regret, Transaction])],
  controllers: [RegretsController],
  providers: [RegretsService],
  exports: [RegretsService],
})
export class RegretsModule {}
