import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminMasterEntity } from './entities/admin-master/admin-master.entity';
import { StatusEntity } from './entities/status/status.entity';
import { RejectedEntity } from './entities/rejected/rejected.entity';
import { DiscrepancyEntity } from './entities/discrepancy/discrepancy.entity';
import { CancelledEntity } from './entities/cancelled/cancelled.entity';
import { ApprovedEntity } from './entities/approved/approved.entity';
import { LogEntity } from './entities/log/log.entity';
import { AdminUserEntity } from './entities/admin-user/admin-user.entity';
import { AdminMasterService } from './admin-master/admin-master.service';
import { AdminMasterController } from './admin-master/admin-master.controller';
import { StatusService } from './status/status.service';
import { StatusController } from './status/status.controller';
import { RejectedService } from './rejected/rejected.service';
import { RejectedController } from './rejected/rejected.controller';
import { DiscrepancyService } from './discrepancy/discrepancy.service';
import { DiscrepancyController } from './discrepancy/discrepancy.controller';
import { CancelledService } from './cancelled/cancelled.service';
import { CancelledController } from './cancelled/cancelled.controller';
import { ApprovedService } from './approved/approved.service';
import { ApprovedController } from './approved/approved.controller';
import { LogService } from './log/log.service';
import { LogController } from './log/log.controller';
import { AdminUserService } from './admin-user/admin-user.service';
import { AdminUserController } from './admin-user/admin-user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdminMasterEntity,
      StatusEntity,
      RejectedEntity,
      DiscrepancyEntity,
      CancelledEntity,
      ApprovedEntity,
      LogEntity,
      AdminUserEntity,
    ]),
  ],
  controllers: [
    AdminMasterController,
    StatusController,
    RejectedController,
    DiscrepancyController,
    CancelledController,
    ApprovedController,
    LogController,
    AdminUserController,
  ],
  providers: [
    AdminMasterService,
    StatusService,
    RejectedService,
    DiscrepancyService,
    CancelledService,
    ApprovedService,
    LogService,
    AdminUserService,
  ],
  exports: [TypeOrmModule],
})
export class AdminModule {} 