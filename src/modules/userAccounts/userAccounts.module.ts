import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsController } from './userAccounts.controller';
import { AccountsService } from './userAccounts.service';
import { UserAccount } from './entities/user-account.entity';
import { UserBank } from './entities/user-bank.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAccount, UserBank]),
  ],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class UserAccountsModule {}