import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoAccountsService } from './crypto-accounts.service';
import { CryptoAccountsController } from './crypto-accounts.controller';
import { CryptoAccounts } from './crypto-accounts.entity';
import { PaymentProviders } from '../../entities/payment-providers.entity';
import { CryptoNetworks } from '../../../catalogs/crypto-networks/crypto-networks.entity';
import { User } from '../../../users/entities/user.entity';
import { Currency } from '../../../catalogs/currencies/currencies.entity';
import { PaymentProvidersModule } from '../../payment-providers/payment-providers.module';
import { UsersModule } from '../../../users/users.module';
import { CryptoNetworksModule } from '../../../catalogs/crypto-networks/crypto-networks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CryptoAccounts, PaymentProviders, CryptoNetworks, User, Currency]),
    PaymentProvidersModule,
    UsersModule,
    CryptoNetworksModule,
  ],
  controllers: [CryptoAccountsController],
  providers: [CryptoAccountsService],
  exports: [CryptoAccountsService],
})
export class CryptoAccountsModule {}
