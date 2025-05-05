import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@users/entities/user.entity';
import { UserProfile } from '@users/entities/user-profile.entity';
import { UserAlternativeEmail } from '@users/entities/user-alternative-email.entity';
import { UserLocation } from '@users/entities/user-location.entity';
import { UserSocials } from '@users/entities/user-socials.entity';
import { UserRewardsLedger } from '@users/entities/user-rewards-ledger.entity';
import { UserCategory } from '@users/entities/user-category.entity';
import { UserContact } from '@users/entities/user-contact.entity';
import { UserQuestion } from '@users/entities/user-question.entity';
import { UserDiscount } from '@users/entities/user-discount.entity';
import { DiscountCode } from '@users/entities/discount-code.entity';
import { UserBan } from '@users/entities/user-ban.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DiscountCode,
      User,
      UserAlternativeEmail,
      UserBan,
      UserCategory,
      UserContact,
      UserDiscount,
      UserLocation,
      UserProfile,
      UserQuestion,
      UserRewardsLedger,
      UserSocials,
    ]),
  ],
})
export class UsersModule {}
