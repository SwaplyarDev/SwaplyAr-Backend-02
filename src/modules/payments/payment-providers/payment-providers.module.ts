import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentProviders } from './payment-providers.entity';
import { PaymentProvidersService } from './payment-providers.service';
import { PaymentProvidersController } from './payment-providers.controller';
import { PaymentPlatforms } from '../payment-platforms/payment-platforms.entity';
import { Countries } from '../../catalogs/countries/countries.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentProviders, PaymentPlatforms, Countries])],
  controllers: [PaymentProvidersController],
  providers: [PaymentProvidersService],
  exports: [PaymentProvidersService],
})
export class PaymentProvidersModule {}
