import { Module } from '@nestjs/common';
import { ReceiverFinancialAccountsService } from './receiver-financial-accounts.service';
import { ReceiverFinancialAccountsController } from './receiver-financial-accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceiverFinancialAccount } from './entities/receiver-financial-account.entity';

@Module({
   imports:[TypeOrmModule.forFeature([ReceiverFinancialAccount])],
  controllers: [ReceiverFinancialAccountsController],
  providers: [ReceiverFinancialAccountsService],
  exports: [ReceiverFinancialAccountsService],
})
export class ReceiverFinancialAccountsModule {}
