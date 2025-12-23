import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { UserSocials } from './entities/user-socials.entity';
import { UserCategory } from './entities/user-category.entity';

import { OtpModule } from '@otp/otp.module';
import { DiscountModule } from 'src/modules/discounts/discounts.module';
import { ProfileModule } from './profile/profile.module';
import { RolesModule } from '../roles/roles.module';
import { Roles } from '../roles/entities/roles.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProfile, UserSocials, UserCategory, Roles]),
    OtpModule,
    DiscountModule,
    ProfileModule,
    RolesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
