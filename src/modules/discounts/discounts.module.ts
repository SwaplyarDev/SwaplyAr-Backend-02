import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@users/entities/user.entity';
import { Transaction } from '@transactions/entities/transaction.entity';
import { DiscountService } from './discounts.service';
import { DiscountsController } from './discounts.controller';
import { AuthModule } from '@auth/auth.module';
import { DiscountCode } from './entities/discount-code.entity';
import { UserDiscount } from './entities/user-discount.entity';
import { UserRewardsLedger } from './entities/user-rewards-ledger.entity';
import { TransactionUserDiscounts } from '@transactions/entities/transaction-user-discounts.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DiscountCode,
      UserDiscount,
      User,
      Transaction,
      UserRewardsLedger,
      TransactionUserDiscounts,
    ]),
    AuthModule,
  ],
  controllers: [DiscountsController],
  providers: [DiscountService],
  exports: [DiscountService],
})
export class DiscountModule {}
