import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdministracionMaster } from './entities/administracion-master.entity';
import { AdministracionStatusLog } from './entities/administracion-status-log.entity';
import { DimAdministrativo } from './entities/dim-administrativo.entity';
import { FileUploadModule } from '../file-upload/file-upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdministracionMaster,
      AdministracionStatusLog,
      DimAdministrativo,
    ]),
    FileUploadModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
