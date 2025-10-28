

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommissionsController } from './controllers/commissions.controller';
import { CommissionsService } from './services/commissions.service';
import { DynamicCommissionsModule } from 'src/modules/dynamic-commissions/dynamicCommissions.module';
import { DynamicCommission } from 'src/modules/dynamic-commissions/entities/dynamicCommissions.entity';
import { CommissionsGateway } from './gateway/commissions.gateway';

@Module({
  imports: [
    DynamicCommissionsModule,
    TypeOrmModule.forFeature([DynamicCommission]),
  ],
  controllers: [CommissionsController],
  providers: [CommissionsService, CommissionsGateway],
  exports: [CommissionsService],
})
export class CommissionsModule {}

