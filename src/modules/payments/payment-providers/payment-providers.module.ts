import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentProviders } from './entities/payment-providers.entity';
import { PaymentProvidersService } from './payment-providers.service';
import { PaymentProvidersController } from './payment-providers.controller';
import { PaymentPlatforms } from '../payment-platforms/entities/payment-platforms.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentProviders, PaymentPlatforms])],
  controllers: [PaymentProvidersController],
  providers: [PaymentProvidersService],
  exports: [PaymentProvidersService],
})
export class PaymentProvidersModule {}
