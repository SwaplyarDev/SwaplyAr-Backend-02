import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from './currencies.entity';
import { CurrenciesService } from './currencies-service';
import { CurrenciesController } from './currencies-controller';
import { Countries } from '../countries/countries.entity';
import { PaymentProviders } from '../../payments/payment-providers/payment-providers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Currency, Countries, PaymentProviders])],
  controllers: [CurrenciesController],
  providers: [CurrenciesService],
  exports: [CurrenciesService, TypeOrmModule],
})
export class CurrenciesModule {}
