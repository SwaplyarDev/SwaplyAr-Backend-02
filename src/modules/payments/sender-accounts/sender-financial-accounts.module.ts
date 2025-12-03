import { Module } from '@nestjs/common';
import { SenderFinancialAccountsService } from './sender-financial-accounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SenderFinancialAccount } from './entities/sender-financial-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SenderFinancialAccount])],
  controllers: [],
  providers: [SenderFinancialAccountsService],
  exports: [SenderFinancialAccountsService],
})
export class SenderFinancialAccountsModule {}
