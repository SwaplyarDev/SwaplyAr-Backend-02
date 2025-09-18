import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsController } from './userAccounts.controller';
import { AccountsService } from './userAccounts.service';
import { UserAccount } from './entities/user-account.entity';
import { FinancialAccountsModule } from '@financial-accounts/financial-accounts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAccount]),
    FinancialAccountsModule, 
  ],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class UserAccountsModule {}