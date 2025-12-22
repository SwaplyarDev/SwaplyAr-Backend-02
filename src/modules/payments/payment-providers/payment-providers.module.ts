import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentProviders } from './entities/payment-providers.entity';
import { PaymentProvidersService } from './payment-providers.service';
import { PaymentProvidersController } from './payment-providers.controller';
import { Countries } from '../../catalogs/countries/countries.entity';
import { Currency } from '../../catalogs/currencies/currencies.entity';
import { BankAccounts } from '../accounts/bank-accounts/bank-accounts.entity';
import { VirtualBankAccounts } from '../accounts/virtual-bank-accounts/virtual-bank-accounts.entity';
import { CryptoAccounts } from '../accounts/crypto-accounts/crypto-accounts.entity';
import { PaymentPlatforms } from '../entities/payment-platforms.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentProviders,
      PaymentPlatforms,
      Countries,
      Currency,
      BankAccounts,
      VirtualBankAccounts,
      CryptoAccounts,
    ]),
  ],
  controllers: [PaymentProvidersController],
  providers: [PaymentProvidersService],
  exports: [PaymentProvidersService],
})
export class PaymentProvidersModule {}
