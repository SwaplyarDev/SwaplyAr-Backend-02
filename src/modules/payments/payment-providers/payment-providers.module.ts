import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentProviders } from './payment-providers.entity';
import { PaymentProvidersService } from './payment-providers.service';
import { PaymentProvidersController } from './payment-providers.controller';
import { PaymentPlatforms } from '../payment-platforms/payment-platforms.entity';
import { Countries } from '../../catalogs/countries/countries.entity';
import { BankAccounts } from '../accounts/bank-accounts/bank-accounts.entity';
import { VirtualBankAccounts } from '../accounts/virtual-bank-accounts/virtual-bank-accounts.entity';
import { CryptoAccounts } from '../accounts/crypto-accounts/crypto-accounts.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentProviders,
      PaymentPlatforms,
      Countries,
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
