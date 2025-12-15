import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialAccountsService } from './financial-accounts.service';
import { FinancialAccountsController } from './financial-accounts.controller';
import { FinancialAccounts } from './entities/financial-accounts.entity';
import { PaymentPlatforms } from '../entities/payment-platforms.entity';
import { User } from '../../users/entities/user.entity';
import { UsersModule } from '../../users/users.module';
import { PaymentPlatformsModule } from '../payment-platforms/payment-platform.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FinancialAccounts, PaymentPlatforms, User]),
    UsersModule,
    PaymentPlatformsModule,
  ],
  controllers: [FinancialAccountsController],
  providers: [FinancialAccountsService],
  exports: [FinancialAccountsService],
})
export class FinancialAccountsModule {}
