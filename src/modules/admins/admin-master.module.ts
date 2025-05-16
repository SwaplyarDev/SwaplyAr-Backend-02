import { Module } from '@nestjs/common';
import { AdminMasterService } from './admin-master.service';
import { AdminMasterController } from './admin-master.controller';

@Module({
  controllers: [AdminMasterController],
  providers: [AdminMasterService],
})
export class AdminMasterModule {}
