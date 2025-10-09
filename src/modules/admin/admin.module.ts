import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '@transactions/entities/transaction.entity';
import { AdministracionStatusLog } from './entities/administracion-status-log.entity';
import { AdministracionMaster } from './entities/administracion-master.entity';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { ProofOfPaymentsModule } from '@financial-accounts/proof-of-payments/proof-of-payments.module';
import { BankModule } from '@financial-accounts/payment-methods/bank/bank.module';
import { UsersModule } from '@users/users.module';
import { ProofOfPayment } from '@financial-accounts/proof-of-payments/entities/proof-of-payment.entity';
import { MailerModule } from '@mailer/mailer.module';
import { DiscountModule } from 'src/modules/discounts/discounts.module';
import { User } from '@users/entities/user.entity';
import { ProfileService } from '@users/profile/profile.service';
import { UserLocation } from '@users/entities/user-location.entity';
import { UserProfile } from '@users/entities/user-profile.entity';
import { AdminProfileController } from './profiles/admin-profile.controller';
import { AdminTransactionController } from './transaction/admin-transaction.controller';
import { AdminTransactionService } from './transaction/admin-transaction.service'; // <-- import service
import { UserSocials } from '@users/entities/user-socials.entity';
import { AdminProfileService } from './profiles/admin-profile.service';
import { AdminUserController } from './users/user-admin.controller';
import { AdminUserService } from './users/user-admin.service';
import { Admin } from 'typeorm';
import { AdminDiscountService } from './discounts/admin-discount.service';
import { AdminDiscountsController } from './discounts/admin-discount.controller';
import { DiscountCode } from '../discounts/entities/discount-code.entity';
import { UserDiscount } from '../discounts/entities/user-discount.entity';
import { UserRewardsLedger } from '../discounts/entities/user-rewards-ledger.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      AdministracionStatusLog,
      AdministracionMaster,
      User,
      ProofOfPayment,
      UserProfile,
      UserLocation,
      UserSocials,
      UserDiscount,
      DiscountCode,
      UserRewardsLedger,
    ]),
    FileUploadModule,
    ProofOfPaymentsModule,
    BankModule,
    UsersModule,
    MailerModule,
    DiscountModule,
  ],
  controllers: [
    AdminProfileController,
    AdminTransactionController,
    AdminUserController,
    AdminDiscountsController,
  ],
  providers: [
    ProfileService,
    AdminTransactionService,
    AdminProfileService,
    AdminUserService,
    AdminDiscountService,
  ],
  exports: [],
})
export class AdminModule {}
