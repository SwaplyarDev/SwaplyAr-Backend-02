import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Transaction } from '@transactions/entities/transaction.entity';
import { AdministracionStatusLog } from './entities/administracion-status-log.entity';
import { AdministracionMaster } from './entities/administracion-master.entity';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { ProofOfPaymentsModule } from '@financial-accounts/proof-of-payments/proof-of-payments.module';
import { BankModule } from '@financial-accounts/payment-methods/bank/bank.module';
import { UsersModule } from '@users/users.module';
import { ProofOfPayment } from '@financial-accounts/proof-of-payments/entities/proof-of-payment.entity';
import { MailerModule } from '@mailer/mailer.module';
import { DiscountModule } from 'src/discounts/discounts.module';
import { User } from '@users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      AdministracionStatusLog,
      AdministracionMaster,
      User,
      ProofOfPayment,
    ]),
    FileUploadModule,
    ProofOfPaymentsModule,
    BankModule,
    UsersModule,
    MailerModule,
    DiscountModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
