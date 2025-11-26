import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { SenderFinancialAccount } from 'src/modules/payments/sender-financial-accounts/entities/sender-financial-account.entity';
import { ReceiverFinancialAccount } from 'src/modules/payments/receiver-financial-accounts/entities/receiver-financial-account.entity';
import { FinancialAccountsModule } from 'src/deprecated/financial-accounts/financial-accounts.module';
import { AmountsService } from './amounts/amounts.service';
import { Amount } from './amounts/entities/amount.entity';
import { ProofOfPaymentsService } from 'src/modules/payments/proof-of-payments/proof-of-payments.service';
import { FileUploadService } from '../file-upload/file-upload.service';
import { ProofOfPayment } from 'src/modules/payments/proof-of-payments/entities/proof-of-payment.entity';
import { CloudinaryService } from 'src/service/cloudinary/cloudinary.service';
import { AdministracionStatusLog } from '@admin/entities/administracion-status-log.entity';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@mailer/mailer.module';
import { UserDiscount } from '../discounts/entities/user-discount.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      SenderFinancialAccount,
      ReceiverFinancialAccount,
      Amount,
      UserDiscount,
      ProofOfPayment,
      AdministracionStatusLog,
    ]),
    FinancialAccountsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey', // tu configuración real
      signOptions: { expiresIn: '60s' }, // o la configuración que uses
    }),
    MailerModule, // Importa el módulo del servicio de correo
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    AmountsService,
    ProofOfPaymentsService,
    FileUploadService,
    CloudinaryService,
  ],
  exports: [
    TransactionsService,
    AmountsService,
    ProofOfPaymentsService,
    FileUploadService,
    CloudinaryService,
  ],
})
export class TransactionsModule {}
