import { Module } from '@nestjs/common';
import { ReceiverFinancialAccountsService } from './receiver-financial-accounts.service';
import { ReceiverFinancialAccountsController } from './receiver-financial-accounts.controller';
import { ReceiverFinancialAccount } from './entities/receiver-financial-account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ReceiverFinancialAccount])],
  controllers: [ReceiverFinancialAccountsController],
  providers: [ReceiverFinancialAccountsService],
})
export class ReceiverFinancialAccountsModule {}
