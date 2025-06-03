import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsController } from './userAccounts.controller';
import { AccountsService } from './userAccounts.service';
import { UserAccount } from './entities/user-account.entity';
import { UserBank } from './entities/user-bank.entity';
import { UserReceiverCrypto } from './entities/user-receiver-crypto.entity';
import { UserVirtualBank } from './entities/user-virtual-bank.entity';
import { UserWise } from './entities/user-wise.entity';
import { UserPayPal } from './entities/user-paypal.entity';
import { UserPayoneer } from './entities/user-payoneer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAccount, 
      UserBank,
      UserVirtualBank,
      UserReceiverCrypto,
      UserPayPal,
      UserWise,
      UserPayoneer,]),
    ],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class UserAccountsModule {}