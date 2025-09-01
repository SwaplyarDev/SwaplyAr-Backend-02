import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsController } from './userAccounts.controller';
import { AccountsService } from './userAccounts.service';
import { UserAccount } from './entities/user-account.entity';
import { UserBank } from './entities/user-bank.entity';
import { UserReceiverCrypto } from './entities/user-receiver-crypto.entity';
import { UserVirtualBank } from './entities/user-virtual-bank.entity';

import { UserPix } from './entities/user-pix.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAccount, UserBank, UserVirtualBank, UserReceiverCrypto, UserPix]),
  ],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class UserAccountsModule {}
