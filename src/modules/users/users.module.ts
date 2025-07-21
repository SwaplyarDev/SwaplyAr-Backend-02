import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { OtpModule } from '@otp/otp.module';
import { DiscountModule } from '@discounts/discounts.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), OtpModule, DiscountModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
