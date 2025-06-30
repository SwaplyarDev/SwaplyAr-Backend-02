import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountService } from '@discount/discount.service';
import { DiscountController } from '@discount/discount.controller';
import { DiscountEntity } from '@discount/entities/discount.entity';
import { UserDiscountEntity } from '@discount/entities/user-discount.entity';
import { RewardEntity } from '@discount/entities/reward.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DiscountEntity,
      UserDiscountEntity,
      RewardEntity,
    ]),
  ],
  controllers: [DiscountController],
  providers: [DiscountService],
  exports: [DiscountService],
})
export class DiscountModule {}
