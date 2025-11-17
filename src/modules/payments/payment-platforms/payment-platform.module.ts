import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentPlatforms } from './payment-platforms.entity';
import { PaymentPlatformsService } from './payment-platforms.service';
import { PaymentPlatformsController } from './payment-platforms.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentPlatforms])],
  controllers: [PaymentPlatformsController],
  providers: [PaymentPlatformsService],
  exports: [PaymentPlatformsService],
})
export class PaymentPlatformsModule {}
