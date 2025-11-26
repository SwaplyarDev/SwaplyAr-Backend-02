import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VirtualBankAccountsService } from './virtual-bank-accounts.service';
import { VirtualBankAccountsController } from './virtual-bank-accounts.controller';
import { VirtualBankAccounts } from './virtual-bank-accounts.entity';
import { PaymentProviders } from '../../entities/payment-providers.entity';
import { User } from '../../../users/entities/user.entity';
import { PaymentProvidersModule } from '../../payment-providers/payment-providers.module';
import { UsersModule } from '../../../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VirtualBankAccounts, PaymentProviders, User]),
    PaymentProvidersModule,
    UsersModule,
  ],
  controllers: [VirtualBankAccountsController],
  providers: [VirtualBankAccountsService],
  exports: [VirtualBankAccountsService],
})
export class VirtualBankAccountsModule {}
