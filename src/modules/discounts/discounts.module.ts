import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountCode } from '@users/entities/discount-code.entity';
import { UserDiscount } from '@users/entities/user-discount.entity';
import { User } from '@users/entities/user.entity';
import { Transaction } from '@transactions/entities/transaction.entity';
import { DiscountService } from './discounts.service';
import { DiscountsController } from './discounts.controller';
import { AuthModule } from '@auth/auth.module';
import { UserRewardsLedger } from '@users/entities/user-rewards-ledger.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([DiscountCode, UserDiscount, User, Transaction, UserRewardsLedger]),
    AuthModule,
  ],
  controllers: [DiscountsController],
  providers: [DiscountService],
  exports: [DiscountService],
})
export class DiscountModule {}
