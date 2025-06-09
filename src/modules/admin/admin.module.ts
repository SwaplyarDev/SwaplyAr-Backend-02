import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdministracionMaster } from './entities/administracion-master.entity';
import { AdministracionStatusLog } from './entities/administracion-status-log.entity';
import { DimAdministrativo } from './entities/dim-administrativo.entity';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { AdminRoleGuard } from '../../common/guards/admin-role.guard';
import { TransactionStatusFieldsMiddleware } from '../../common/middlewares/transaction-status-fields.middleware';
import { UpdateReceiverFieldsMiddleware } from '../../common/middlewares/update-receiver-fields.middleware';
import { UpdateTransactionFieldsMiddleware } from '../../common/middlewares/update-transaction-fields.middleware';
import { Transaction } from '../transactions/entities/transaction.entity';
import { ProofOfPaymentsModule } from '@financial-accounts/proof-of-payments/proof-of-payments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdministracionMaster,
      AdministracionStatusLog,
      DimAdministrativo,
      Transaction,
    ]),
    FileUploadModule,
    ProofOfPaymentsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminRoleGuard],
  exports: [AdminService],
})
export class AdminModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TransactionStatusFieldsMiddleware)
      .forRoutes({ path: 'admin/transactions/status/:status', method: RequestMethod.POST })
      .apply(UpdateReceiverFieldsMiddleware)
      .forRoutes({ path: 'admin/transactions/:id/receiver', method: RequestMethod.PUT })
      .apply(UpdateTransactionFieldsMiddleware)
      .forRoutes({ path: 'admin/transactions/:id', method: RequestMethod.PUT });
  }
}
