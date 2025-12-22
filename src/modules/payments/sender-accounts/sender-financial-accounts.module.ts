import { Module } from '@nestjs/common';
import { SenderFinancialAccountsService } from './sender-financial-accounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SenderFinancialAccount } from './entities/sender-financial-account.entity';
import { PaymentProvidersModule } from '../payment-providers/payment-providers.module';
import { UsersModule } from '@users/users.module';
import { User } from '@users/entities/user.entity';
import { Countries } from '../entities/countries.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SenderFinancialAccount, User, Countries]),
    PaymentProvidersModule,
    UsersModule,
  ],
  controllers: [],
  providers: [SenderFinancialAccountsService],
  exports: [SenderFinancialAccountsService],
})
export class SenderFinancialAccountsModule {}
