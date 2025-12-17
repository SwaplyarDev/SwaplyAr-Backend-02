import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccountsService } from './bank-accounts.service';
import { BankAccountsController } from './bank-accounts.controller';
import { BankAccounts } from './bank-accounts.entity';
import { BankAccountDetails } from './bank-account-details.entity';
import { PaymentProviders } from '../../payment-providers/payment-providers.entity';
import { User } from '../../../users/entities/user.entity';
import { Countries } from '../../../catalogs/countries/countries.entity';
import { PaymentProvidersModule } from '../../payment-providers/payment-providers.module';
import { UsersModule } from '../../../users/users.module';
import { Currency } from 'src/modules/catalogs/currencies/currencies.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BankAccounts, BankAccountDetails, PaymentProviders, User, Countries, Currency]),
    PaymentProvidersModule,
    UsersModule,
  ],
  controllers: [BankAccountsController],
  providers: [BankAccountsService],
  exports: [BankAccountsService],
})
export class BankAccountsModule {}
